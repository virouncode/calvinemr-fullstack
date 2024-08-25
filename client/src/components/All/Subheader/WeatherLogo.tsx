import React from "react";
import { useWeather } from "../../../hooks/reactquery/queries/weatherQueries";
import CircularProgressSmall from "../../UI/Progress/CircularProgressSmall";

const WeatherLogo = () => {
  const { data: weather, isLoading, error } = useWeather();
  if (isLoading) return <CircularProgressSmall />;
  if (!error)
    return (
      <div className="subheader-section__weather">
        <div className="subheader-section__weather-logo">
          <img src={weather?.current.condition.icon} alt="weather-logo" />
        </div>
        <p>{weather?.current.temp_c}°C</p>
      </div>
    );
};

export default WeatherLogo;
