import React from "react";
import { TimeSlotType } from "../../../../types/api";
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
  handleCheckUnavailable: (
    e: React.ChangeEvent<HTMLInputElement>,
    day: string,
    partOfTheDay: "morning" | "afternoon"
  ) => void;
  handleModeChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    day: string,
    partOfTheDay: "morning" | "afternoon"
  ) => void;
  scheduleMorning: TimeSlotType[];
  scheduleAfternoon: TimeSlotType[];
};

const AvailabilityItem = ({
  day,
  handleStartMorningChange,
  handleEndMorningChange,
  handleStartAfternoonChange,
  handleEndAfternoonChange,
  handleCheckUnavailable,
  handleModeChange,
  scheduleMorning,
  scheduleAfternoon,
}: AvailabilityItemProps) => {
  const morningUnavailable = scheduleMorning[0].appointment_modes.length === 0;
  const afternoonUnavailable =
    scheduleAfternoon[0].appointment_modes.length === 0;

  return (
    <div className="calendar__availability-editor-row">
      <div className="calendar__availability-editor-day">
        {firstLetterUpper(day)}
      </div>
      <div className="calendar__availability-editor-time">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <TimePickerAvailability
            day={day}
            handleChange={handleStartMorningChange}
            readOnly={morningUnavailable}
            timeValueHour={scheduleMorning[0].hours}
            timeValueMin={scheduleMorning[0].min}
            timeValueAMPM={scheduleMorning[0].ampm}
          />
          <p>To</p>
          <TimePickerAvailability
            day={day}
            handleChange={handleEndMorningChange}
            readOnly={morningUnavailable}
            timeValueHour={scheduleMorning[1].hours}
            timeValueMin={scheduleMorning[1].min}
            timeValueAMPM={scheduleMorning[1].ampm}
          />
        </div>
        <div className="calendar__availability-editor-mode">
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              id={`appointment_mode-morning-in-person-${day}`}
              onChange={(e) => handleModeChange(e, day, "morning")}
              checked={scheduleMorning[0].appointment_modes.includes(
                "in-person"
              )}
              name="in-person"
              label="In person"
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              id={`appointment_mode-morning-visio-${day}`}
              onChange={(e) => handleModeChange(e, day, "morning")}
              checked={scheduleMorning[0].appointment_modes.includes("visio")}
              name="visio"
              label="Video call"
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              id={`appointment_mode-morning-phone-${day}`}
              onChange={(e) => handleModeChange(e, day, "morning")}
              checked={scheduleMorning[0].appointment_modes.includes("phone")}
              name="phone"
              label="Phone call"
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              id={`notavailable-morning-${day}`}
              onChange={(e) => handleCheckUnavailable(e, day, "morning")}
              checked={morningUnavailable}
              label="Not available"
            />
          </div>
        </div>
      </div>
      <div className="calendar__availability-editor-time">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <TimePickerAvailability
            day={day}
            handleChange={handleStartAfternoonChange}
            readOnly={afternoonUnavailable}
            timeValueHour={scheduleAfternoon[0].hours}
            timeValueMin={scheduleAfternoon[0].min}
            timeValueAMPM={scheduleAfternoon[0].ampm}
          />
          <p>To</p>
          <TimePickerAvailability
            day={day}
            handleChange={handleEndAfternoonChange}
            readOnly={afternoonUnavailable}
            timeValueHour={scheduleAfternoon[1].hours}
            timeValueMin={scheduleAfternoon[1].min}
            timeValueAMPM={scheduleAfternoon[1].ampm}
          />
        </div>
        <div className="calendar__availability-editor-mode">
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              id={`appointment_mode-afternoon-in-person-${day}`}
              onChange={(e) => handleModeChange(e, day, "afternoon")}
              checked={scheduleAfternoon[0].appointment_modes.includes(
                "in-person"
              )}
              name="in-person"
              label="In person"
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              id={`appointment_mode-afternoon-visio-${day}`}
              onChange={(e) => handleModeChange(e, day, "afternoon")}
              checked={scheduleAfternoon[0].appointment_modes.includes("visio")}
              name="visio"
              label="Video call"
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              id={`appointment_mode-afternoon-phone-${day}`}
              onChange={(e) => handleModeChange(e, day, "afternoon")}
              checked={scheduleAfternoon[0].appointment_modes.includes("phone")}
              name="phone"
              label="Phone call"
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              id={`notavailable-afternoon-${day}`}
              onChange={(e) => handleCheckUnavailable(e, day, "afternoon")}
              checked={afternoonUnavailable}
              label="Not available"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityItem;
