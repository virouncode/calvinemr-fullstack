import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchWeather = async () => {
  const response = await axios.get("/api/weather");
  return response.data;
};

export const useWeather = () => {
  return useQuery({
    queryKey: ["weather"],
    queryFn: fetchWeather,
    refetchInterval: 3600000,
  });
};
