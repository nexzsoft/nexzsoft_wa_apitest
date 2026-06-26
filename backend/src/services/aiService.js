// services/aiService.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateReply = async (clinicName, message) => {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: `You are assistant for ${clinicName}` },
      { role: "user", content: message }
    ]
  });

  return response.choices[0].message.content;
};