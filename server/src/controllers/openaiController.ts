import dotenv from "dotenv";
import { Request, Response } from "express";
import OpenAI from "openai";

dotenv.config(); // Load environment variables

// Initialize OpenAI client
const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION_ID!,
  project: process.env.OPENAI_PROJECT_ID!,
});

// Define type for the message object
interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Streamed response from ChatGPT
const postChatGPTStream = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { messages }: { messages: AIMessage[] } = req.body;

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
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
      res.status(500).send({ error: err.message });
    } else {
      res.status(500).send({ error: "Unknown error occurred" });
    }
  }
};

// Full response from ChatGPT
const postChatGPTFull = async (req: Request, res: Response): Promise<void> => {
  const { messages }: { messages: AIMessage[] } = req.body;

  try {
    const response = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
    });

    res.send(response.choices[0].message.content);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err);
      res.status(500).send({ error: err.message });
    } else {
      res.status(500).send({ error: "Unknown error occurred" });
    }
  }
};

// Export the functions
export { postChatGPTFull, postChatGPTStream };
