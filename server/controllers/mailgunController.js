const formData = require("form-data");
require("dotenv").config();
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

const postEmail = async (req, res) => {
  const { to, subject, text } = req.body;
  //to array of strings
  try {
    const response = await mg.messages.create("mg.calvinemr.com", {
      from: process.env.MAILGUN_SENDER_EMAIL,
      to,
      subject,
      text,
    });
    res.status(200).send(response);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { postEmail };
