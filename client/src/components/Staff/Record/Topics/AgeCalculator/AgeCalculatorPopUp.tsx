import { DateTime } from "luxon";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  dateISOToTimestampTZ,
  getAgeTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import InputDate from "../../../../UI/Inputs/InputDate";
import InputNumber from "../../../../UI/Inputs/InputNumber";

type AgeCalculatorPopUpProps = {
  patientDob: number;
};

const AgeCalculatorPopUp = ({ patientDob }: AgeCalculatorPopUpProps) => {
  //Hooks
  const [age, setAge] = useState<number | "">(getAgeTZ(patientDob));
  const [date, setDate] = useState(timestampToDateISOTZ(nowTZTimestamp()));

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      setAge("");
      setDate("");
      return;
    }
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue)) {
      toast.error("Please enter a valid number.", { containerId: "A" });
      return;
    }
    const birthDate = DateTime.fromMillis(patientDob, {
      zone: "America/Toronto",
    });
    const targetDateMs = birthDate.plus({ years: parsedValue }).toMillis();
    setAge(parsedValue);
    setDate(timestampToDateISOTZ(targetDateMs));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    const birthDate = DateTime.fromMillis(patientDob, {
      zone: "America/Toronto",
    });
    const givenDate = DateTime.fromMillis(
      dateISOToTimestampTZ(value) as number,
      {
        zone: "America/Toronto",
      }
    );
    setAge(Math.floor(givenDate.diff(birthDate, "years").years));
    setDate(value);
  };

  return (
    <div className="age-calculator">
      <h1 className="age-calculator__title">Age Calculator</h1>
      <form className="age-calculator__form">
        <div className="age-calculator__form-row">
          <InputNumber
            value={age}
            onChange={handleAgeChange}
            id="age"
            name="age"
            label="Age"
            autoFocus={true}
            step="1"
            min="0"
          />
        </div>
        <div className="age-calculator__form-row">
          <InputDate
            value={date}
            onChange={handleDateChange}
            id="date"
            label="Date"
            min={timestampToDateISOTZ(patientDob)}
          />
        </div>
      </form>
    </div>
  );
};

export default AgeCalculatorPopUp;
