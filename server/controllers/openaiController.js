var OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

const postChatGPTStream = async (req, res) => {
  const { messages } = req.body;
  try {
    const stream = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
      stream: true,
    });
    for await (const chunk of stream) {
      res.write(chunk.choices[0]?.delta?.content || "");
    }
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
};

const postChatGPTFull = async (req, res) => {
  const { messages } = req.body;
  try {
    const response = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
    });
    res.send(response.choices[0].message.content);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
};

module.exports = { postChatGPTStream, postChatGPTFull };
