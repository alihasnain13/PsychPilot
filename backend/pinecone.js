// pinecone.js
const { PineconeClient } = require("@pinecone-database/pinecone");
const pinecone = new PineconeClient();
const indexName = "therapy-chatbot-2023";
const myUser = "ah13";

/**
 * Initialize Pinecone with the given environment and API key.
 */
async function initializePinecone() {
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT,
    apiKey: process.env.PINECONE_API_KEY,
  });
}

/**
 * Insert vectors into Pinecone. This function will first check if the index exists.
 * If not, it will create one. It will then batch insert the vectors into Pinecone.
 *
 * @param {Object} embeddingsDict - A dictionary of embeddings to be inserted.
 */
async function upsertVectorsToPinecone(embeddingsDict, userIdentifier) {
  const indexes = await pinecone.listIndexes();
  if (!indexes.includes(indexName)) {
    await pinecone.createIndex({
      createRequest: {
        name: indexName,
        dimension: 1536,
      },
    });
  }

  const index = pinecone.Index(indexName);
  const entries = Object.entries(embeddingsDict);
  const batchSize = 64;

  for (let i = 0; i < entries.length; i += batchSize) {
    let batch = entries.slice(i, i + batchSize).map(([key, value], j) => {
      // Create a timestamp for the current vector
      let timestamp = Date.now() + j;
      return {
        id: "vector-" + timestamp,
        values: value.data.data[0].embedding,
        metadata: { text: key, timestamp: timestamp, userID: userIdentifier },
      };
    });

    const upsertRequest = { vectors: batch, namespace: userIdentifier };
    await index.upsert({ upsertRequest });
    console.log("Added vector batch to pinecone!");
  }
}

/**
 * Query Pinecone to search for a specific user ID.
 *
 * @param {String} user - The user ID to search for.
 * @returns {Object} The query response from Pinecone.
 */
async function searchForUserID(userIdentifier) {
  const index = pinecone.Index(indexName);

  const queryVector = {
    namespace: userIdentifier,
    topK: 1,
    vector: Array(1536).fill(0),
  };

  const queryResponse = await index.query({ queryRequest: queryVector });
  console.log(queryResponse)

  if (queryResponse.matches.length === 0) {
    return false;
  } else {
    return true;
  }
}

async function getRelatedConversations(queryEmbedding, userIdentifier) {
  const index = pinecone.Index(indexName);

  const queryVector = {
    namespace: userIdentifier,
    topK: 10,
    vector: queryEmbedding[0].data.data[0].embedding,
    includeMetadata: true,
  };
  console.log(queryVector)
  const queryResponse = await index.query({ queryRequest: queryVector });
  console.log("Related vectorss retrieved.");

  let noRelatedConversations = false;

  // loop through matches, extract text from metadata and combine them into a string
  let combinedText =
    "For context, these are some excerpts from your previous conversations with the user. Please use these to further understand/hone what you are going to reply to them.";
  queryResponse.matches.forEach((match) => {
    
    if (match.metadata) {
      if (match.score > 0.85) {
        noRelatedConversations = true;
        combinedText += match.metadata.text + "\n";
      }
    }
  });

  if (noRelatedConversations === false) {
    return "";
  }

  return combinedText;
}

module.exports = {
  initializePinecone,
  upsertVectorsToPinecone,
  searchForUserID,
  getRelatedConversations,
};
