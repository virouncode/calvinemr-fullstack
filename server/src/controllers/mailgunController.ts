import dotenv from "dotenv";
import { Request, Response } from "express";
import formData from "form-data";
import Mailgun from "mailgun.js";

dotenv.config(); // Load environment variables

// Initialize Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_SENDING_API_KEY!,
});

const postEmail = async (req: Request, res: Response): Promise<void> => {
  console.log("post email");

  const { to, subject, text }: { to: string; subject: string; text: string } =
    req.body;

  if (!to) res.status(400).send({ error: "recipient email is required" });

  try {
    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.MAILGUN_SENDER_EMAIL!,
      to,
      subject,
      text,
    });
    res.status(200).send(response);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Mailgun error:", err.message);
      res.status(500).send({ error: err.message });
    } else {
      res.status(500).send({ error: "Unknown error occurred" });
    }
  }
};

// Export the function as a module
export { postEmail };
