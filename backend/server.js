// Importing required modules
require("dotenv").config();
const express = require("express");
const { initializePinecone, searchForUserID } = require("./pinecone");
const getChatbotResponse = require("./chatbot");
const { processConversation } = require("./conversation");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");
const serviceAccount = require("./therapy-chatbot-e046b-firebase-adminsdk-upfao-55ba579239.json");

// Firebase initialization
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Firestore database initialization

initializePinecone(); // Pinecone initialization

const app = express(); // Express app initialization

app.use(bodyParser.json()); // Use body parser to parse JSON request bodies

// Setting up CORS options
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: true,
};

// Using CORS middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middleware for handling errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server Error");
});

/**
 * Middleware for authenticating token
 */
function authenticateToken(req, res, next) {
  if (req.method === "OPTIONS") {
    console.log("Pre-flight request recieved!");
    next();
  } else {
    const idToken = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (!idToken) {
      console.log("Token is empty.");
      return res.sendStatus(401);
    }

    admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        console.log("Token verified!");
        req.user = decodedToken;
        next();
      })
      .catch((error) => {
        console.error("Error verifying token:", error);
        res.sendStatus(403);
      });
  }
}

/**
 * Route for creating new conversation
 */
app.post("/api/chatbot/create", authenticateToken, async (req, res) => {
  console.log("------------ CHATBOT/CREATE ENDPOINT HIT -------------");
  const userID = req.user.uid; // Using uid from the decoded token
  const conversationID = Date.now(); // Creating a new conversation ID

  // Create a collection reference
  const collectionRef = db.collection(`conversations${userID}`);

  // Set the document with the conversation ID
  await collectionRef.doc(`${conversationID}`).set({
    docName: `${conversationID}`,
    created: admin.firestore.Timestamp.now(),
    numMessages: 0, // Initialize numMessages field
  });

  // Return conversation ID
  res.send({ conversationID });
});

/**
 * POST endpoint to retrieve chatbot response.
 * It verifies the existence of a user, gets the response from the chatbot,
 * and adds the user's message and the bot's response to the database.
 * Finally, it increments the number of messages in the conversation by 2.
 */
app.post("/api/chatbot", authenticateToken, async (req, res) => {
  try {
    console.log("CHATBOT ENDPOINT HIT");
    const { userInput, conversationID, userName } = req.body;
    const { uid: userID } = req.user; // Using uid from the decoded token

    const isExistingUser = await searchForUserID(userID);
    const chatbotResponse = await getChatbotResponse(
      userInput,
      userID,
      isExistingUser,
      userName 
    );

    const collectionRef = db.collection(`conversations${userID}`);
    const conversationRef = collectionRef.doc(`${conversationID}`);
    const messagesRef = conversationRef.collection("messages");

    const currentTimeStamp = admin.firestore.Timestamp.now();

    // Adding user message and bot response
    await Promise.all([
      messagesRef.add({
        message: userInput,
        messageType: "user",
        timestamp: currentTimeStamp,
      }),
      messagesRef.add({
        message: chatbotResponse,
        messageType: "bot",
        timestamp: currentTimeStamp,
      }),
      conversationRef.update({
        numMessages: admin.firestore.FieldValue.increment(2),
      }),
    ]);

    console.log("Message added to conversation!");
    res.send({ reply: chatbotResponse });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.toString() });
  }
});

/**
 * POST endpoint to end a conversation.
 * It retrieves the user's messages, processes the conversation, and uploads the vectors.
 */
app.post("/api/chatbot/end", authenticateToken, async (req, res) => {
  try {
    console.log("CHATBOT/END ENDPOINT HIT");
    const { uid: userID } = req.user; // Using uid from the decoded token
    const { conversationID } = req.body; // Getting conversationID from the client

    const conversationRef = db
      .collection(`conversations${userID}`)
      .doc(`${conversationID}`)
      .collection("messages");
    const conversation = await conversationRef.get();

    const messages = conversation.docs
      .filter((doc) => doc.data().messageType === "user")
      .map((doc) => doc.data().message)
      .join("\n");

    await processConversation(messages, userID);
    res.send({ message: "Conversation processed and vectors uploaded." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.toString() });
  }
});

/**
 * POST endpoint to retrieve chat history for a user.
 * It gets the documents from the Firestore collection and returns them in ascending order of creation.
 */
app.post("/api/chathistory", authenticateToken, async (req, res) => {
  try {
    console.log("CHATHISTORY ENDPOINT HIT");
    const { uid: userID } = req.user; // Using uid from the decoded token

    const collectionName = `conversations${userID}`;
    const docRef = db.collection(collectionName).orderBy("created", "asc");
    const doc = await docRef.get();

    if (doc.empty) {
      console.log("No documents found for the user!");
      return res.status(200).json({});
    }

    const data = doc.docs.map((documentSnapshot) => documentSnapshot.data());
    console.log("Document data:", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error getting document:", error);
    res.status(500).send("Error getting document");
  }
});

const fetchChatHistoryDetails = async (req, res) => {
  console.log("------------ CHATHISTORY DETAILS ENDPOINT HIT -------------");
  const userID = req.user.uid; // Using uid from the decoded token
  const conversationID = req.body.conversationID; // Getting conversationID from the client
  console.log(`Fetching message details for conversation: ${conversationID}`);

  const collectionName = `conversations${userID}`;
  const documentName = `${conversationID}`;

  try {
    const messagesRef = db
      .collection(collectionName)
      .doc(documentName)
      .collection("messages")
      .orderBy("timestamp", "asc");
    const messages = await messagesRef.get();

    let userMessages = [];
    let botMessages = [];

    if (messages.empty) {
      console.log("No messages in this conversation!");
    } else {
      messages.forEach((documentSnapshot) => {
        let messageData = documentSnapshot.data();
        if (messageData.messageType === "user") {
          userMessages.push(messageData.message);
        } else if (messageData.messageType === "bot") {
          botMessages.push(messageData.message);
        }
      });

      //{ {sender:user,message:"ccc"}{sender:user,message:"ccc"}{}}

      console.log("User messages:", userMessages);
      console.log("Bot messages:", botMessages);
    }

    // Return the results regardless of them being empty or not
    res.status(200).json({ userMessages, botMessages });
  } catch (error) {
    console.log("Error getting document:", error);
    res.status(500).send("Error getting document");
  }
};

const fetchChatHistoryDetails2 = async (req, res) => {
  console.log("------------ CHAT RELOAD DETAILS ENDPOINT HIT -------------");
  const userID = req.user.uid; // Using uid from the decoded token
  const conversationID = req.body.conversationID; // Getting conversationID from the client
  console.log(`Fetching message details for conversation: ${conversationID}`);

  const collectionName = `conversations${userID}`;
  const documentName = `${conversationID}`;

  try {
      const messagesRef = db.collection(collectionName).doc(documentName).collection("messages").orderBy('timestamp', 'asc');
      const messages = await messagesRef.get();

      let userMessages = [];
      let botMessages = [];

      if (messages.empty) {
          console.log('No messages in this conversation!');
      } else {
          messages.forEach((documentSnapshot) => {
              let messageData = documentSnapshot.data();
              if(messageData.messageType === 'user') {
                  userMessages.push({
                      sender: 'user',
                      message: messageData.message
                  });
              } else if(messageData.messageType === 'bot') {
                  botMessages.push({
                      sender: 'bot',
                      message: messageData.message
                  });
              }
          });
      }

      let combinedMessages = [];
      for (let i = 0; i < userMessages.length; i++) {
          combinedMessages.push(userMessages[i]);
          combinedMessages.push(botMessages[i]);
      }

      console.log('Combined messages:', combinedMessages);
      res.status(200).json(combinedMessages);

  } catch (error) {
      console.log('Error getting document:', error);
      res.status(500).send('Error getting document');
  }
};


/**
 * POST endpoint to retrieve detailed chat history for a specific conversation.
 * It fetches the messages from the Firestore collection, separates them by type (user or bot),
 * and returns them in ascending order of timestamp.
 */
// Use the modularized function for the endpoint
app.post(
  "/api/chathistory/details",
  authenticateToken,
  fetchChatHistoryDetails
);

app.post("/api/chatbot/reload", authenticateToken, fetchChatHistoryDetails2);

// Starts the server, which is listening on port 3001
app.listen(3001, () => console.log("Server is listening on port 3001"));
