import React from "react";
import { DayType } from "../../../types/app";

const hoursOptions = Array.from({ length: 12 }, (_, i) => {
  const value = (i + 1).toString().padStart(2, "0");
  return (
    <option value={value} key={value}>
      {value}
    </option>
  );
});

const minutesOptions = Array.from({ length: 60 }, (_, i) => {
  const value = i.toString().padStart(2, "0");
  return (
    <option value={value} key={value}>
      {value}
    </option>
  );
});

type TimePickerAvailabilityProps = {
  handleChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    day: DayType,
    name: "hours" | "min" | "ampm"
  ) => void;
  timeValueHour: string;
  timeValueMin: string;
  timeValueAMPM: string;
  readOnly?: boolean;
  day: DayType;
};
const TimePickerAvailability = ({
  handleChange,
  timeValueHour,
  timeValueMin,
  timeValueAMPM,
  readOnly = false,
  day,
}: TimePickerAvailabilityProps) => {
  return (
    <div className="time-picker">
      <select
        className="time-picker-hours"
        onChange={(e) => handleChange(e, day, "hours")}
        value={timeValueHour}
        disabled={readOnly}
        style={{ width: "40px" }}
      >
        {hoursOptions}
      </select>
      <select
        className="time-picker-min"
        onChange={(e) => handleChange(e, day, "min")}
        value={timeValueMin}
        name="min"
        disabled={readOnly}
        style={{ width: "40px", marginLeft: "3px" }}
      >
        {minutesOptions}
      </select>
      <select
        className="time-picker-12"
        onChange={(e) => handleChange(e, day, "ampm")}
        value={timeValueAMPM}
        name="ampm"
        disabled={readOnly}
        style={{ width: "45px", marginLeft: "3px" }}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export default TimePickerAvailability;
