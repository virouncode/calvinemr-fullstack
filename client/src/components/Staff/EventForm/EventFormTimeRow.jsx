import Checkbox from "../../UI/Checkbox/Checkbox";
import DateTimePicker from "../../UI/Pickers/DateTimePicker";
import DurationPicker from "../../UI/Pickers/DurationPicker";

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
}) => {
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
              : parseInt(formDatas.Duration / 60)
                  .toString()
                  .padStart(2, "0")
          }
          durationMin={
            formDatas.all_day
              ? "00"
              : parseInt(formDatas.Duration % 60)
                  .toString()
                  .padStart(2, "0")
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
