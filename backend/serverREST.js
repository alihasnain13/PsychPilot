require("dotenv").config();
const express = require("express");
const { initializePinecone, searchForUserID } = require("./pinecone");
const getChatbotResponse = require("./chatbot");
const { processConversation } = require("./conversation");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");
const serviceAccount = require("./therapy-chatbot-e046b-firebase-adminsdk-upfao-55ba579239.json");

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Firestore database
const db = admin.firestore();

// Initialize Pinecone
initializePinecone();

// Initialize your Express app
const app = express();

// Use body parser middleware to parse JSON bodies
app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server Error");
});

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
    numMessages: 0  // Initialize numMessages field
  });

  // Return conversation ID
  res.send({ conversationID });
});

app.post("/api/chatbot", authenticateToken, async (req, res) => {
  console.log("------------ CHATBOT ENDPOINT HIT -------------");
  const userInput = req.body.userInput;
  const userID = req.user.uid; // Using uid from the decoded token
  const conversationID = req.body.conversationID; // Getting conversationID from the client

  console.log("Conversation id: ", conversationID);

  try {
    const isExistingUser = await searchForUserID(userID);

    const chatbotResponse = await getChatbotResponse(
      userInput,
      userID,
      isExistingUser
    );

    console.log("Response received!");

    const collectionRef = db.collection(`conversations${userID}`);
    const conversationRef = collectionRef.doc(`${conversationID}`);

    const messagesRef = conversationRef.collection("messages");

    // Adding user message
    await messagesRef.add({
      message: userInput,
      messageType: "user",
      timestamp: admin.firestore.Timestamp.now(),
    });

    // Adding bot response
    await messagesRef.add({
      message: chatbotResponse,
      messageType: "bot",
      timestamp: admin.firestore.Timestamp.now(),
    });

    // Increment numMessages field by 2 (for user message and bot response)
    await conversationRef.update({
      numMessages: admin.firestore.FieldValue.increment(2)
    });

    console.log("Message added to conversation!");

    res.send({ reply: chatbotResponse });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

app.post("/api/chatbot/end", authenticateToken, async (req, res) => {
  console.log("------------ CHATBOT/END ENDPOINT HIT -------------");

  try {
    const userID = req.user.uid; // Using uid from the decoded token
    const conversationID = req.body.conversationID; // Getting conversationID from the client

    const conversationRef = db
      .collection(`conversations${userID}`)
      .doc(`${conversationID}`)
      .collection("messages");

    const conversation = await conversationRef.get();
    console.log("This is the conversation: ", conversation);

    const messages = conversation.docs
      .filter((doc) => doc.data().messageType === "user")
      .map((doc) => doc.data().message)
      .join("\n");

    console.log("These are the user messages: ", messages);

    await processConversation(messages, userID);

    res.send({ message: "Conversation processed and vectors uploaded." });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
});

app.post("/api/chathistory", authenticateToken, async (req, res) => {
  console.log("------------ CHATHISTORY ENDPOINT HIT -------------");
  const userID = req.user.uid; // Using uid from the decoded token
  console.log(`Processing chat history for user: ${userID}`);

  const collectionName = `conversations${userID}`;

  try {
    const docRef = db.collection(collectionName).orderBy('created', 'asc');
    const doc = await docRef.get();

    if (doc.empty) {
      console.log('No such document!');
      res.status(404).send('No such document!');
    } else {
      let data = [];
      doc.forEach((documentSnapshot) => {
        data.push(documentSnapshot.data());
      });
      console.log('Document data:', data);
      res.status(200).json(data);
    }
  } catch (error) {
    console.log('Error getting document:', error);
    res.status(500).send('Error getting document');
  }
});

app.post("/api/chathistory/details", authenticateToken, async (req, res) => {
  console.log("------------ CHATHISTORY DETAILS ENDPOINT HIT -------------");
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
      res.status(404).send('No messages in this conversation!');
    } else {
      messages.forEach((documentSnapshot) => {
        let messageData = documentSnapshot.data();
        if(messageData.messageType === 'user') {
          userMessages.push(messageData.message);
        } else if(messageData.messageType === 'bot') {
          botMessages.push(messageData.message);
        }
      });

      console.log('User messages:', userMessages);
      console.log('Bot messages:', botMessages);
      res.status(200).json({ userMessages, botMessages });
    }
  } catch (error) {
    console.log('Error getting document:', error);
    res.status(500).send('Error getting document');
  }
});





app.listen(3001, () => console.log("Server is listening on port 3001"));
