import dotenv from "dotenv";
import { Request, Response } from "express";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { handleError, handleSuccess } from "../utils/helper";
dotenv.config();

type WeatherResponse = {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: { text: string; icon: string };
    wind_kph: number;
    humidity: number;
    feelslike_c: number;
    last_updated: string;
  };
};

export const getWeather = async (req: Request, res: Response) => {
  try {
    const { city = "Toronto" } = req.query;

    const url = `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}&aqi=no`;

    const response = await fetchWithTimeout(url, { method: "GET" }, 8000);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Weather API error: ${errorText}`);
    }

    const data: WeatherResponse = await response.json();

    return handleSuccess({
      result: data,
      status: 200,
      message: `Current weather for ${data.location.name}, ${data.location.country}`,
      res,
    });
  } catch (err) {
    return handleError({ err, res });
  }
};
