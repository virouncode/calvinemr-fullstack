require("dotenv").config();
var twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const postTwilio = async (req, res) => {
  const { to, body } = req.body;
  try {
    const response = await twilio.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
      body,
    });
    res
      .status(200)
      .send(JSON.stringify({ success: true, data: response.data }));
  } catch (err) {
    console.error(err);
    res
      .status(err.status)
      .send(JSON.stringify({ success: false, message: err.message }));
  }
};

module.exports = { postTwilio };
