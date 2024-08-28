import dotenv from "dotenv";
import { Request, Response } from "express";
import twilio from "twilio";

// Load environment variables
dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

// Error handling function to handle different types of errors
const handleError = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  } else if (typeof err === "string") {
    return err;
  } else {
    return "An unknown error occurred";
  }
};

// Post a message using Twilio API
export const postTwilio = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { to, body } = req.body;

  try {
    const response = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
      body,
    });

    res.status(200).json({ success: true, data: response });
  } catch (err) {
    const errorMessage = handleError(err);
    console.error(errorMessage);
    const statusCode = (err as { status?: number }).status || 500;
    res.status(statusCode).json({ success: false, message: errorMessage });
  }
};
