import dotenv from "dotenv";
import { Request, Response } from "express";
import twilio from "twilio";
import { handleSuccess, handleError } from "../utils/helper";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

// 📩 Envoyer un SMS via Twilio
export const postTwilio = async (req: Request, res: Response) => {
  try {
    const { to, body } = req.body;

    if (!to || !body) {
      throw new Error("Missing required parameters: 'to' and 'body'");
    }

    const message = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
      body,
    });

    return handleSuccess({
      result: message,
      status: 200,
      message: "SMS sent successfully",
      res,
    });
  } catch (err) {
    return handleError({ err, res });
  }
};
