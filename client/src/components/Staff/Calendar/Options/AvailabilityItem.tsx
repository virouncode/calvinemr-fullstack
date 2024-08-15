import React from "react";
import { firstLetterUpper } from "../../../../utils/strings/firstLetterUpper";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import TimePickerAvailability from "../../../UI/Pickers/TimePickerAvailability";

type AvailabilityItemProps = {
  day: string;
  handleStartMorningChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    day: string,
    name: string
  ) => void;
  handleEndMorningChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    day: string,
    name: string
  ) => void;
  handleStartAfternoonChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    day: string,
    name: string
  ) => void;
  handleEndAfternoonChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    day: string,
    name: string
  ) => void;
  handleCheck: (e: React.ChangeEvent<HTMLInputElement>, day: string) => void;
  scheduleMorning: { hours: string; min: string; ampm: string }[];
  scheduleAfternoon: { hours: string; min: string; ampm: string }[];
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
