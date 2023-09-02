// openai.js
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

async function getReplyFromChatbot(messages) {
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: messages
  });
  return response.data.choices[0].message.content;
}

async function generateEmbeddings(chunks) {
  return await Promise.all(chunks.map(chunk => openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: chunk
  })));
}

module.exports = {getReplyFromChatbot, generateEmbeddings};
