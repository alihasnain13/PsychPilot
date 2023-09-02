require("dotenv").config();
const { getReplyFromChatbot, generateEmbeddings } = require("./openai");
const { getRelatedConversations } = require("./pinecone");

const TOKEN_LIMIT = 4096; // Token limit for the OpenAI model
let chatHistory = []; // Store the chat history
let addSystemMessage = 0;

/**
 * Count the total tokens in a list of messages. Note: this function does not accurately
 * count tokens the same way the OpenAI API does, but it's a close approximation.
 *
 * @param {Array} messages - The messages to count tokens for.
 * @returns {Number} The total tokens in the messages.
 */
function countTokens(messages) {
  return messages.reduce(
    (acc, curr) => acc + curr.content.split(/\s+/).length,
    0
  );
}

async function getChatbotResponse(
  userInput,
  userIdentifier,
  isExistingUser = false,
  userName,
) {
  try {
    let relatedConversations = "";
    if (userInput.length > 15) {
      let userInputEmbedding = await generateEmbeddings([userInput]);
      console.log("qwert");
      relatedConversations = await getRelatedConversations(
        userInputEmbedding,
        userIdentifier
      );
    }
    console.log("qwert2");
    let messages = [
      {
        role: "user",
        content: userInput,
      },
    ];

    // Add system message only in the beginning
    if (addSystemMessage === 0) {
      const systemMessage = isExistingUser
        ? `Welcome back! Remember, you are a helpful assistant acting as a therapist. You've already spoken to this person before as their therapist, so greet them accordingly so. Ask them how they've been since the last time they spoke to you, and if anything new has happened that they might want to talk about. Their full name is ${userName}. To keep this things casual, refer to them with their first name`
        : `You are a helpful assistant acting as a therapist. Greet the user kindly, and ask them how they're doing. Their full name is ${userName}, but try to refer to them with their first name to keep things comfortable and casual.`;

      messages.unshift({
        role: "system",
        content: systemMessage,
      });

      messages.unshift({
        role: "system",
        content:
          "Remember, you are their therapist and have to help them out with anything they may be experiencing. Try to learn more about them, and then help them that way.",
      });

      addSystemMessage = 1;
    }
    else if (addSystemMessage === 1) {
      chatHistory.shift(); // remove the systemMessage from the chat history
      // chatHistory.shift();
      addSystemMessage = 2;
    }

    // Combine the history with the new message
    chatHistory = [...chatHistory, ...messages];

    if (relatedConversations != "") {
      // Check if the relatedConversations string will exceed the token limit when added
      if (
        countTokens(chatHistory) + relatedConversations.split(/\s+/).length <=
        TOKEN_LIMIT
      ) {
        // If not, append the relatedConversations to the chat history
        chatHistory.push({
          role: "assistant",
          content: relatedConversations,
        });
      } else {
        // If so, trim the relatedConversations string and then add it
        let remainingTokens = TOKEN_LIMIT - countTokens(chatHistory);
        let relatedConvTokens = relatedConversations.split(/\s+/);
        let trimmedConversations = relatedConvTokens
          .slice(-remainingTokens)
          .join(" ");

        chatHistory.push({
          role: "assistant",
          content: trimmedConversations,
        });
      }
    } else {
      console.log("No suitable context found!");
    }

    // Make sure the chat history doesn't exceed the maximum token limit
    while (countTokens(chatHistory) > TOKEN_LIMIT) {
      if (chatHistory.length > 1) {
        // Remove the oldest message
        chatHistory.shift();
      } else {
        // If there's only one message and it exceeds the limit, truncate it
        const singleMessage = chatHistory[0];
        const truncatedMessage = singleMessage.content.slice(-TOKEN_LIMIT);
        chatHistory[0] = {
          role: singleMessage.role,
          content: truncatedMessage,
        };
      }
    }

    // FOR DEBUGGING PURPOSES
    console.log("______________________________");
    console.log(chatHistory);
    console.log("______________________________");

    const chatbotReply = await getReplyFromChatbot(chatHistory);
    return { chatbotReply };
  } catch (error) {
    throw error;
  }
}

module.exports = getChatbotResponse;
