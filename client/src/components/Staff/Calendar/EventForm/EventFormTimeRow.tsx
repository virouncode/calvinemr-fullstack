import React from "react";
import { AppointmentType } from "../../../../types/api";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import DateTimePicker from "../../../UI/Pickers/DateTimePicker";
import DurationPicker from "../../../UI/Pickers/DurationPicker";

type EventFormTimeRowProps = {
  formDatas: AppointmentType;
  refDateStart: React.RefObject<HTMLInputElement>;
  refMinutesStart: React.RefObject<HTMLSelectElement>;
  refHoursStart: React.RefObject<HTMLSelectElement>;
  refAMPMStart: React.RefObject<HTMLSelectElement>;
  refDateEnd: React.RefObject<HTMLInputElement>;
  refMinutesEnd: React.RefObject<HTMLSelectElement>;
  refHoursEnd: React.RefObject<HTMLSelectElement>;
  refAMPMEnd: React.RefObject<HTMLSelectElement>;
  handleStartChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleEndChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleDurationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleCheckAllDay: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const EventFormTimeRow = ({
  formDatas,
  refDateStart,
  refMinutesStart,
  refHoursStart,
  refAMPMStart,
  refDateEnd,
  refMinutesEnd,
  refHoursEnd,
  refAMPMEnd,
  handleStartChange,
  handleEndChange,
  handleDurationChange,
  handleCheckAllDay,
}: EventFormTimeRowProps) => {
  return (
    <div className="event-form__row">
      <div className="event-form__item">
        <DateTimePicker
          value={formDatas.start}
          refDate={refDateStart}
          refHours={refHoursStart}
          refMinutes={refMinutesStart}
          refAMPM={refAMPMStart}
          timezone="America/Toronto"
          locale="en-CA"
          handleChange={handleStartChange}
          label="Start"
        />
      </div>
      <div className="event-form__item">
        <DateTimePicker
          value={formDatas.end}
          refDate={refDateEnd}
          refHours={refHoursEnd}
          refMinutes={refMinutesEnd}
          refAMPM={refAMPMEnd}
          timezone="America/Toronto"
          locale="en-CA"
          handleChange={handleEndChange}
          label="End"
        />
      </div>

      <div className="event-form__item">
        <DurationPicker
          durationHours={
            formDatas.all_day
              ? "24"
              : Math.floor(formDatas.Duration / 60)
                  .toString()
                  .padStart(2, "0")
          }
          durationMin={
            formDatas.all_day
              ? "00"
              : (formDatas.Duration % 60).toString().padStart(2, "0")
          }
          disabled={formDatas.all_day}
          handleChange={handleDurationChange}
          label="Duration"
        />
      </div>
      <div className="event-form__item">
        <Checkbox
          id="all-day"
          onChange={handleCheckAllDay}
          checked={formDatas.all_day}
          label="All Day"
        />
      </div>
    </div>
  );
};

export default EventFormTimeRow;
