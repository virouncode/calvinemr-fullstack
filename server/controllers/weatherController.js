require("dotenv").config();
const axios = require("axios");

const getWeather = async (req, res) => {
  const { to, body } = req.body;
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=Toronto&aqi=no`
    );
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

module.exports = { getWeather };
