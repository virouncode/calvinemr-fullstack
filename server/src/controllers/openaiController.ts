import dotenv from "dotenv";
import { Request, Response } from "express";
import OpenAI from "openai";
import { handleError, handleSuccess } from "../utils/helper";

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION_ID!,
  project: process.env.OPENAI_PROJECT_ID!,
});

// Type pour un message de chat
interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// 💬 Endpoint : génération complète (non streamée)
export const postChatGPTFull = async (req: Request, res: Response) => {
  try {
    const { messages }: { messages: AIMessage[] } = req.body;

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Missing or invalid 'messages' array in request body");
    }

    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
    });

    const content = completion.choices[0]?.message?.content ?? "";

    return handleSuccess({
      result: content,
      status: 200,
      message: "ChatGPT response generated successfully",
      res,
    });
  } catch (err) {
    return handleError({ err, res });
  }
};

// 💬 Endpoint : génération en streaming (utile pour front interactif)
export const postChatGPTStream = async (req: Request, res: Response) => {
  try {
    const { messages }: { messages: AIMessage[] } = req.body;

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Missing or invalid 'messages' array in request body");
    }

    const stream = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
      stream: true,
    });

    // Envoie des chunks au fur et à mesure
    res.setHeader("Content-Type", "text/plain; charset=utf-8");

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || "";
      res.write(text);
    }

    res.end();
  } catch (err) {
    return handleError({ err, res });
  }
};
