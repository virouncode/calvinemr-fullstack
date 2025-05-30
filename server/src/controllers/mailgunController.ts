import dotenv from "dotenv";
import { Request, Response } from "express";
import formData from "form-data";
import Mailgun from "mailgun.js";

dotenv.config(); // Load environment variables

// Initialize Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
});

const postEmail = async (req: Request, res: Response): Promise<void> => {
  const { to, subject, text }: { to: string[]; subject: string; text: string } =
    req.body;

  try {
    const response = await mg.messages.create("mg.calvinemr.com", {
      from: process.env.MAILGUN_SENDER_EMAIL!,
      to, // Array of strings for multiple recipients
      subject,
      text,
    });
    res.status(200).send(response);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send({ error: err.message });
    } else {
      res.status(500).send({ error: "Unknown error occurred" });
    }
  }
};

// Export the function as a module
export { postEmail };
