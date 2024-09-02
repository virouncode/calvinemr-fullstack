import { cloneDeep } from "lodash";
import React, { useEffect, useState } from "react";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useAvailabilityPut } from "../../../../hooks/reactquery/mutations/availabilityMutations";
import { AvailabilityType, ScheduleType } from "../../../../types/api";
import { DayType, UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { availabilitySchema } from "../../../../validation/calendar/availabilityValidation";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SubmitButton from "../../../UI/Buttons/SubmitButton";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import DurationPicker from "../../../UI/Pickers/DurationPicker";
import AvailabilityItem from "./AvailabilityItem";

type AvailabilityEditorProps = {
  availability: AvailabilityType;
  setEditAvailability: React.Dispatch<React.SetStateAction<boolean>>;
};

const AvailabilityEditor = ({
  availability,
  setEditAvailability,
}: AvailabilityEditorProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [progress, setProgress] = useState(false);
  const [itemInfos, setItemInfos] = useState<AvailabilityType>(availability);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setItemInfos(cloneDeep(availability));
  }, [availability]);

  const availabilityPut = useAvailabilityPut(user.id);

  const days: DayType[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Validation
    const scheduleToPut: AvailabilityType = {
      ...itemInfos,
      date_created: nowTZTimestamp(),
    };

    try {
      await availabilitySchema.validate(scheduleToPut);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    setProgress(true);
    availabilityPut.mutate(scheduleToPut, {
      onSuccess: () => {
        setEditAvailability(false);
      },
      onSettled: () => setProgress(false),
    });
  };

  const handleStartMorningChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    day: DayType,
    name: "hours" | "min" | "ampm"
  ) => {
    const value = e.target.value;
    const scheduleMorningUpdated: ScheduleType = {
      ...itemInfos.schedule_morning,
    };
    if (name === "ampm")
      scheduleMorningUpdated[day][0][name] = value as "AM" | "PM";
    else scheduleMorningUpdated[day][0][name] = value;
    setItemInfos({
      ...itemInfos,
      schedule_morning: scheduleMorningUpdated,
    });
  };
  const handleEndMorningChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    day: DayType,
    name: "hours" | "min" | "ampm"
  ) => {
    const value = e.target.value;
    const scheduleMorningUpdated: ScheduleType = {
      ...itemInfos.schedule_morning,
    };
    if (name === "ampm")
      scheduleMorningUpdated[day][1][name] = value as "AM" | "PM";
    else scheduleMorningUpdated[day][1][name] = value;
    setItemInfos({
      ...itemInfos,
      schedule_morning: scheduleMorningUpdated,
    });
  };
  const handleStartAfternoonChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    day: DayType,
    name: "hours" | "min" | "ampm"
  ) => {
    const value = e.target.value;
    const scheduleAfternoonUpdated: ScheduleType = {
      ...itemInfos.schedule_afternoon,
    };
    if (name === "ampm")
      scheduleAfternoonUpdated[day][0][name] = value as "AM" | "PM";
    else scheduleAfternoonUpdated[day][0][name] = value;
    setItemInfos({
      ...itemInfos,
      schedule_afternoon: scheduleAfternoonUpdated,
    });
  };
  const handleEndAfternoonChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    day: DayType,
    name: "hours" | "min" | "ampm"
  ) => {
    const value = e.target.value;
    const scheduleAfternoonUpdated: ScheduleType = {
      ...itemInfos.schedule_afternoon,
    };
    if (name === "ampm")
      scheduleAfternoonUpdated[day][1][name] = value as "AM" | "PM";
    else scheduleAfternoonUpdated[day][1][name] = value;
    setItemInfos({
      ...itemInfos,
      schedule_afternoon: scheduleAfternoonUpdated,
    });
  };
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, day: string) => {
    const checked = e.target.checked;
    setItemInfos({
      ...itemInfos,
      unavailability: {
        ...itemInfos.unavailability,
        [day]: checked,
      },
    });
  };
  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setErrMsg("");
    const value = e.target.value === "" ? 0 : parseInt(e.target.value);
    const name = e.target.name;
    switch (name) {
      case "hoursDuration":
        setItemInfos({
          ...itemInfos,
          default_duration_hours: value,
        });
        break;
      case "minutesDuration":
        setItemInfos({
          ...itemInfos,
          default_duration_min: value,
        });
        break;
      default:
        return;
    }
  };

  const handleCancel = () => {
    setItemInfos(availability);
    setEditAvailability(false);
  };

  return (
    itemInfos && (
      <div>
        {errMsg && <ErrorParagraph errorMsg={errMsg} />}
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
              scheduleMorning={itemInfos.schedule_morning[day]}
              scheduleAfternoon={itemInfos.schedule_afternoon[day]}
              unavailable={itemInfos.unavailability[day]}
              key={day}
            />
          ))}
          <div className="availability__duration">
            <label>Default appointment duration</label>
            <DurationPicker
              durationHours={itemInfos.default_duration_hours
                .toString()
                .padStart(2, "0")}
              durationMin={itemInfos.default_duration_min
                .toString()
                .padStart(2, "0")}
              handleChange={handleDurationChange}
              disabled={false}
            />
          </div>
          <div className="availability__btns">
            <SubmitButton label="Save" disabled={progress} />
            <CancelButton onClick={handleCancel} disabled={progress} />
          </div>
        </form>
      </div>
    )
  );
};

export default AvailabilityEditor;
