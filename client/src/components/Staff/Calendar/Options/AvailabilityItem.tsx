import React from "react";
import { DayType } from "../../../../types/app";
import { firstLetterUpper } from "../../../../utils/strings/firstLetterUpper";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import TimePickerAvailability from "../../../UI/Pickers/TimePickerAvailability";

type AvailabilityItemProps = {
  day: DayType;
  handleStartMorningChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    day: DayType,
    name: "hours" | "min" | "ampm"
  ) => void;
  handleEndMorningChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    day: DayType,
    name: "hours" | "min" | "ampm"
  ) => void;
  handleStartAfternoonChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    day: DayType,
    name: "hours" | "min" | "ampm"
  ) => void;
  handleEndAfternoonChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    day: DayType,
    name: "hours" | "min" | "ampm"
  ) => void;
  handleCheck: (e: React.ChangeEvent<HTMLInputElement>, day: string) => void;
  scheduleMorning: { hours: string; min: string; ampm: "AM" | "PM" }[];
  scheduleAfternoon: { hours: string; min: string; ampm: "AM" | "PM" }[];
  unavailable: boolean;
};

const AvailabilityItem = ({
  day,
  handleStartMorningChange,
  handleEndMorningChange,
  handleStartAfternoonChange,
  handleEndAfternoonChange,
  handleCheck,
  scheduleMorning,
  scheduleAfternoon,
  unavailable,
}: AvailabilityItemProps) => {
  return (
    <div className="availability__row">
      <div className="availability__column--day">{firstLetterUpper(day)}</div>
      <div className="availability__column--time">
        <TimePickerAvailability
          day={day}
          handleChange={handleStartMorningChange}
          readOnly={unavailable}
          timeValueHour={scheduleMorning[0].hours}
          timeValueMin={scheduleMorning[0].min}
          timeValueAMPM={scheduleMorning[0].ampm}
        />
        <p>To</p>
        <TimePickerAvailability
          day={day}
          handleChange={handleEndMorningChange}
          readOnly={unavailable}
          timeValueHour={scheduleMorning[1].hours}
          timeValueMin={scheduleMorning[1].min}
          timeValueAMPM={scheduleMorning[1].ampm}
        />
      </div>
      <div className="availability__column--time">
        <TimePickerAvailability
          day={day}
          handleChange={handleStartAfternoonChange}
          readOnly={unavailable}
          timeValueHour={scheduleAfternoon[0].hours}
          timeValueMin={scheduleAfternoon[0].min}
          timeValueAMPM={scheduleAfternoon[0].ampm}
        />
        <p>To</p>
        <TimePickerAvailability
          day={day}
          handleChange={handleEndAfternoonChange}
          readOnly={unavailable}
          timeValueHour={scheduleAfternoon[1].hours}
          timeValueMin={scheduleAfternoon[1].min}
          timeValueAMPM={scheduleAfternoon[1].ampm}
        />
      </div>
      <div className="availability__column--checkbox">
        <Checkbox
          id={`notavailable-${day}`}
          onChange={(e) => handleCheck(e, day)}
          checked={unavailable}
          label="Not available"
        />
      </div>
    </div>
  );
};

export default AvailabilityItem;
