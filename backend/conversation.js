require("dotenv").config();
const fs = require("fs");
const path = require("path");

const { generateEmbeddings } = require("./openai");
const { upsertVectorsToPinecone } = require("./pinecone");

/**
 * Create a dictionary that maps chunks of text to their embeddings.
 *
 * @param {Array} chunks - The chunks of text.
 * @param {Array} embeddings - The embeddings of the chunks of text.
 * @returns {Object} A dictionary that maps chunks of text to their embeddings.
 */
function createEmbeddingsDict(chunks, embeddings) {
  let embeddingsDict = {};
  for (let i = 0; i < chunks.length; i++) {
    embeddingsDict[chunks[i]] = embeddings[i];
  }
  return embeddingsDict;
}

/**
 * Process the conversation by splitting it into chunks, generating embeddings for each chunk,
 * and inserting the embeddings into Pinecone.
 *
 * @param {String} conversationText - The conversation text.
 * @param {String} userIdentifier - The user identifier.
 */
async function processConversation(conversationText, userIdentifier) {
  try {
    const chunks = splitIntoChunks(conversationText, 5);
    const embeddings = await generateEmbeddings(chunks).catch((err) => {
      console.error(`Error generating embeddings: ${err}`);
    });
    const embeddingsDict = createEmbeddingsDict(chunks, embeddings);
    await upsertVectorsToPinecone(embeddingsDict, userIdentifier).catch((err) => {
      console.error(`Error upserting vectors to Pinecone: ${err}`);
    });
    console.log("Vectors generated and uploaded to pinecone.")
  } catch (err) {
    console.error(`Error processing conversation: ${err}`);
  }
}


/**
 * Split the data into chunks.
 *
 * @param {String} data - The data to be split.
 * @param {Number} sentencesPerChunk - The number of sentences per chunk.
 * @returns {Array} An array of chunks.
 */
function splitIntoChunks(data, sentencesPerChunk) {
  // Split the conversation into sentences
  const sentences = data.split(". ");

  let chunks = [];
  for (let i = 0; i < sentences.length; i += sentencesPerChunk) {
    // Slice the array of sentences to get the next chunk
    let chunk = sentences.slice(i, i + sentencesPerChunk);
    // Join the sentences back together and add the chunk to the array
    chunks.push(chunk.join(". "));
  }

  return chunks;
}

module.exports = {
  processConversation,
  createEmbeddingsDict,
  splitIntoChunks,
};
