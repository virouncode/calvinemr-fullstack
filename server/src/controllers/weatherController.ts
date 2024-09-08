import axios from "axios";
import dotenv from "dotenv";
import { Request, Response } from "express";
dotenv.config();
axios.defaults.withCredentials = true;

const handleError = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  } else if (typeof err === "string") {
    return err;
  } else {
    return "An unknown error occurred";
  }
};

export const getWeather = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=Toronto&aqi=no`
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (err) {
    const errorMessage = handleError(err);
    console.error(errorMessage);

    // Check if err has a status code, if not fallback to 500
    const statusCode = (err as { status?: number }).status || 500;

    res.status(statusCode).json({ success: false, message: errorMessage });
  }
};
