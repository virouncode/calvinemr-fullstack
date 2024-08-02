import { useEffect, useState } from "react";

import useUserContext from "../../../../hooks/context/useUserContext";

import { useUserSchedulePut } from "../../../../hooks/reactquery/mutations/userScheduleMutations";
import { useUserSchedule } from "../../../../hooks/reactquery/queries/userScheduleQueries";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { availabilitySchema } from "../../../../validation/calendar/availabilityValidation";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import DurationPicker from "../../../UI/Pickers/DurationPicker";
import AvailabilityItem from "./AvailabilityItem";

const AvailabilityEditor = ({ setEditAvailabilityVisible }) => {
  const { user } = useUserContext();
  const [progress, setProgress] = useState(false);
  const userSchedule = useUserSchedule(user.id);
  const schedulePut = useUserSchedulePut(user.id);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    if (userSchedule.data) {
      setSchedule(userSchedule.data);
    }
  }, [userSchedule.data]);

  const [errMsg, setErrMsg] = useState("");
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    const scheduleToPut = {
      ...schedule,
      date_created: nowTZTimestamp(),
    };

    try {
      await availabilitySchema.validate(scheduleToPut);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    setProgress(true);
    schedulePut.mutate(scheduleToPut, {
      onSuccess: () => {
        setProgress(false);
        setEditAvailabilityVisible(false);
      },
      onError: () => setProgress(false),
    });
  };
  const handleStartMorningChange = (e, day, name) => {
    const value = e.target.value;
    let scheduleMorningUpdated = { ...schedule.schedule_morning };
    scheduleMorningUpdated[day][0][name] = value;
    setSchedule({ ...schedule, schedule_morning: scheduleMorningUpdated });
  };
  const handleEndMorningChange = (e, day, name) => {
    const value = e.target.value;
    let scheduleMorningUpdated = { ...schedule.schedule_morning };
    scheduleMorningUpdated[day][1][name] = value;
    setSchedule({ ...schedule, schedule_morning: scheduleMorningUpdated });
  };
  const handleStartAfternoonChange = (e, day, name) => {
    const value = e.target.value;
    let scheduleAfternoonUpdated = { ...schedule.schedule_afternoon };
    scheduleAfternoonUpdated[day][0][name] = value;
    setSchedule({ ...schedule, schedule_morning: scheduleAfternoonUpdated });
  };
  const handleEndAfternoonChange = (e, day, name) => {
    const value = e.target.value;
    let scheduleAfternoonUpdated = { ...schedule.schedule_afternoon };
    scheduleAfternoonUpdated[day][1][name] = value;
    setSchedule({ ...schedule, schedule_morning: scheduleAfternoonUpdated });
  };
  const handleCheck = (e, day) => {
    const checked = e.target.checked;
    setSchedule({
      ...schedule,
      unavailability: { ...schedule.unavailability, [day]: checked },
    });
  };
  const handleDurationChange = (e) => {
    setErrMsg("");
    const value = e.target.value === "" ? 0 : parseInt(e.target.value);
    const name = e.target.name;
    switch (name) {
      case "hoursDuration":
        setSchedule({ ...schedule, default_duration_hours: value });
        break;
      case "minutesDuration":
        setSchedule({ ...schedule, default_duration_min: value });
        break;
      default:
        return;
    }
  };

  const handleCancel = () => {
    setEditAvailabilityVisible(false);
  };

  if (userSchedule.isPending)
    return (
      <div className="availability__heads">
        <LoadingParagraph />
      </div>
    );
  if (userSchedule.isError)
    return (
      <div className="availability__heads">
        <ErrorParagraph errorMsg={userSchedule.error} />
      </div>
    );

  return (
    schedule && (
      <div>
        {errMsg && <p className="availability__err">{errMsg}</p>}
        <div className="availability__heads">
          <p>Morning</p>
          <p>Afternoon</p>
        </div>
        <form className="availability__form" onSubmit={handleSubmit}>
          {days.map((day) => (
            <AvailabilityItem
              day={day}
              handleStartMorningChange={handleStartMorningChange}
              handleEndMorningChange={handleEndMorningChange}
              handleStartAfternoonChange={handleStartAfternoonChange}
              handleEndAfternoonChange={handleEndAfternoonChange}
              handleCheck={handleCheck}
              scheduleMorning={schedule.schedule_morning[day]}
              scheduleAfternoon={schedule.schedule_afternoon[day]}
              unavailable={schedule.unavailability[day]}
              key={day}
            />
          ))}
          <div className="availability__duration">
            <label>Default appointment duration</label>
            <DurationPicker
              durationHours={schedule.default_duration_hours
                .toString()
                .padStart(2, "0")}
              durationMin={schedule.default_duration_min
                .toString()
                .padStart(2, "0")}
              handleChange={handleDurationChange}
              disabled={false}
              label={false}
            />
          </div>
          <div className="availability__btns">
            <input type="submit" value="Save" disabled={progress} />
            <button onClick={handleCancel} disabled={progress}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  );
};

export default AvailabilityEditor;
