import dotenv from "dotenv";
import { Request, Response } from "express";
import formData from "form-data";
import Mailgun from "mailgun.js";
import { handleSuccess, handleError } from "../utils/helper";

dotenv.config(); // Load environment variables

// Initialize Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_SENDING_API_KEY!,
});

export const postEmail = async (req: Request, res: Response) => {
  try {
    const { to, subject, text }: { to: string; subject: string; text: string } =
      req.body;

    if (!to) {
      throw new Error("Recipient email is required");
    }

    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.MAILGUN_SENDER_EMAIL!,
      to,
      subject,
      text,
    });

    return handleSuccess({
      result,
      status: 200,
      message: "Email sent successfully via Mailgun",
      res,
    });
  } catch (err) {
    return handleError({ err, res });
  }
};
