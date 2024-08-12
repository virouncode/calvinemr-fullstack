import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { WeatherType } from "../../../types/api";

const fetchWeather = async (): Promise<WeatherType> => {
  const response = await axios.get("/api/weather");
  return response.data.data;
};

export const useWeather = () => {
  return useQuery({
    queryKey: ["weather"],
    queryFn: fetchWeather,
    refetchInterval: 3600000,
  });
};
