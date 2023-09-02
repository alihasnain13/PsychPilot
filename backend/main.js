require("dotenv").config();
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const { initializePinecone, searchForUserID } = require("./pinecone");
const getChatbotResponse = require("./chatbot");
const { processConversation } = require("./conversation");

const myID = "ah06";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Initialize Pinecone
initializePinecone();

// Create a new directory 'conversations' if it does not exist
const dir = "./conversations";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Generate a timestamp and use it to create a unique filename for each conversation
let timestamp = Date.now();
const conversationFile = path.join(dir, `conversation${timestamp}.txt`);
const conversationStream = fs.createWriteStream(conversationFile, {
  flags: "a",
});

let isFirstMessage = true;

rl.setPrompt("You: ");
rl.prompt();

rl.on("line", async (userInput) => {
  if (
    userInput.toLowerCase() === "exit" ||
    userInput.toLowerCase() === "clear"
  ) {
    rl.close();
  } else {
    conversationStream.write(userInput + "\n");

    // Check if the user exists in Pinecone database on first message
    if (isFirstMessage) {
      const isExistingUser = await searchForUserID(myID);
      if (isExistingUser) {
        console.log("User has conversed with chatbot before!");
        // Pass an additional parameter to getChatbotResponse to indicate existing user
        getChatbotResponse(userInput, myID, true)
          .then((response) => {
            console.log("Chatbot:", response.chatbotReply);
            rl.prompt();
          })
          .catch((error) => console.error(error));
      } else {
        console.log("User has NOT conversed with chatbot before!");
        getChatbotResponse(userInput, myID, false)
          .then((response) => {
            console.log("Chatbot:", response.chatbotReply);
            rl.prompt();
          })
          .catch((error) => console.error(error));
      }
      isFirstMessage = false;
    } else {
      getChatbotResponse(userInput, myID)
        .then((response) => {
          console.log("Chatbot:", response.chatbotReply);
          rl.prompt();
        })
        .catch((error) => console.error(error));
    }
  }
}).on("close", () => {
  console.log("Chatbot: Goodbye! Looking forward to seeing you again!");
  conversationStream.end();
  processConversation(conversationFile, myID);
});
