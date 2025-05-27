import React, { useEffect, useState } from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useAvailabilityPut } from "../../../../hooks/reactquery/mutations/availabilityMutations";
import { AvailabilityType } from "../../../../types/api";
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
  const { staffInfos } = useStaffInfosContext();
  useEffect(() => {
    setItemInfos(availability);
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
    const availabilityToPut: AvailabilityType = {
      ...itemInfos,
      date_created: nowTZTimestamp(),
    };
    try {
      await availabilitySchema.validate(availabilityToPut);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    setProgress(true);
    availabilityPut.mutate(availabilityToPut, {
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
    if (name === "ampm") {
      setItemInfos({
        ...itemInfos,
        schedule_morning: {
          ...itemInfos.schedule_morning,
          [day]: [
            {
              ...itemInfos.schedule_morning[day][0],
              [name]: value as "AM" | "PM",
            },
            itemInfos.schedule_morning[day][1],
          ],
        },
      });
    } else {
      setItemInfos({
        ...itemInfos,
        schedule_morning: {
          ...itemInfos.schedule_morning,
          [day]: [
            {
              ...itemInfos.schedule_morning[day][0],
              [name]: value,
            },
            itemInfos.schedule_morning[day][1],
          ],
        },
      });
    }
  };
  const handleEndMorningChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    day: DayType,
    name: "hours" | "min" | "ampm"
  ) => {
    const value = e.target.value;

    if (name === "ampm") {
      setItemInfos({
        ...itemInfos,
        schedule_morning: {
          ...itemInfos.schedule_morning,
          [day]: [
            itemInfos.schedule_morning[day][0],
            {
              ...itemInfos.schedule_morning[day][1],
              [name]: value as "AM" | "PM",
            },
          ],
        },
      });
    } else {
      setItemInfos({
        ...itemInfos,
        schedule_morning: {
          ...itemInfos.schedule_morning,
          [day]: [
            itemInfos.schedule_morning[day][0],
            {
              ...itemInfos.schedule_morning[day][1],
              [name]: value,
            },
          ],
        },
      });
    }
  };
  const handleStartAfternoonChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    day: DayType,
    name: "hours" | "min" | "ampm"
  ) => {
    const value = e.target.value;

    if (name === "ampm") {
      setItemInfos({
        ...itemInfos,
        schedule_afternoon: {
          ...itemInfos.schedule_afternoon,
          [day]: [
            {
              ...itemInfos.schedule_afternoon[day][0],
              [name]: value as "AM" | "PM",
            },
            itemInfos.schedule_afternoon[day][1],
          ],
        },
      });
    } else {
      setItemInfos({
        ...itemInfos,
        schedule_afternoon: {
          ...itemInfos.schedule_afternoon,
          [day]: [
            {
              ...itemInfos.schedule_afternoon[day][0],
              [name]: value,
            },
            itemInfos.schedule_afternoon[day][1],
          ],
        },
      });
    }
  };
  const handleEndAfternoonChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    day: DayType,
    name: "hours" | "min" | "ampm"
  ) => {
    const value = e.target.value;

    if (name === "ampm") {
      setItemInfos({
        ...itemInfos,
        schedule_afternoon: {
          ...itemInfos.schedule_afternoon,
          [day]: [
            itemInfos.schedule_afternoon[day][0],
            {
              ...itemInfos.schedule_afternoon[day][1],
              [name]: value as "AM" | "PM",
            },
          ],
        },
      });
    } else {
      setItemInfos({
        ...itemInfos,
        schedule_afternoon: {
          ...itemInfos.schedule_afternoon,
          [day]: [
            itemInfos.schedule_afternoon[day][0],
            {
              ...itemInfos.schedule_afternoon[day][1],
              [name]: value,
            },
          ],
        },
      });
    }
  };
  const handleCheckUnavailable = (
    e: React.ChangeEvent<HTMLInputElement>,
    day: string,
    partOfTheDay: "morning" | "afternoon"
  ) => {
    const checked = e.target.checked;
    setItemInfos({
      ...itemInfos,
      [`schedule_${partOfTheDay}`]: {
        ...itemInfos[`schedule_${partOfTheDay}`],
        [day]: itemInfos[`schedule_${partOfTheDay}`][
          day as keyof AvailabilityType["schedule_morning"]
        ].map((range) => {
          if (checked) {
            return {
              ...range,
              appointment_modes: [],
            };
          } else {
            return {
              ...range,
              appointment_modes: ["in-person", "visio", "phone"],
            };
          }
        }),
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

  const handleModeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    day: string,
    partOfTheDay: "morning" | "afternoon"
  ) => {
    const checked = e.target.checked;
    const mode = e.target.name;
    if (checked) {
      setItemInfos({
        ...itemInfos,
        [`schedule_${partOfTheDay}`]: {
          ...itemInfos[`schedule_${partOfTheDay}`],
          [day]: itemInfos[`schedule_${partOfTheDay}`][
            day as keyof AvailabilityType["schedule_morning"]
          ].map((range) => ({
            ...range,
            appointment_modes: [...range.appointment_modes, mode],
          })),
        },
      });
    } else {
      setItemInfos({
        ...itemInfos,
        [`schedule_${partOfTheDay}`]: {
          ...itemInfos[`schedule_${partOfTheDay}`],
          [day]: itemInfos[`schedule_${partOfTheDay}`][
            day as keyof AvailabilityType["schedule_morning"]
          ].map((range) => ({
            ...range,
            appointment_modes: range.appointment_modes.filter(
              (m) => m !== mode
            ),
          })),
        },
      });
    }
  };

  const handleCancel = () => {
    setItemInfos(availability);
    setEditAvailability(false);
  };

  return (
    itemInfos && (
      <div className="calendar__availability-editor">
        {errMsg && <ErrorParagraph errorMsg={errMsg} />}

        <form
          className="calendar__availability-editor-form"
          onSubmit={handleSubmit}
        >
          <div className="calendar__availability-editor-row">
            <p style={{ width: "10%" }}></p>
            <p className="calendar__availability-editor-head">Morning</p>
            <p className="calendar__availability-editor-head">Afternoon</p>
            <p></p>
          </div>
          {days.map((day) => (
            <AvailabilityItem
              day={day}
              handleStartMorningChange={handleStartMorningChange}
              handleEndMorningChange={handleEndMorningChange}
              handleStartAfternoonChange={handleStartAfternoonChange}
              handleEndAfternoonChange={handleEndAfternoonChange}
              handleCheckUnavailable={handleCheckUnavailable}
              handleModeChange={handleModeChange}
              scheduleMorning={itemInfos.schedule_morning[day]}
              scheduleAfternoon={itemInfos.schedule_afternoon[day]}
              key={day}
            />
          ))}
          <div className="calendar__availability-editor-duration">
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
          <div className="calendar__availability-editor-btns">
            <SubmitButton label="Save" disabled={progress} />
            <CancelButton onClick={handleCancel} disabled={progress} />
          </div>
        </form>
      </div>
    )
  );
};

export default AvailabilityEditor;
