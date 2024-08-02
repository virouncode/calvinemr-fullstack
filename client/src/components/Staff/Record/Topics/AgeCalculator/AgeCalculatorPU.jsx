import { DateTime } from "luxon";
import { useState } from "react";
import {
    dateISOToTimestampTZ,
    getAgeTZ,
    nowTZTimestamp,
    timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";

const AgeCalculatorPU = ({ patientDob }) => {
  const [age, setAge] = useState(getAgeTZ(patientDob));
  const [date, setDate] = useState(timestampToDateISOTZ(nowTZTimestamp()));

  const handleAgeChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setAge(value);
      setDate("");
    } else {
      const birthDate = DateTime.fromMillis(patientDob, {
        zone: "America/Toronto",
      });
      const targetDateMs = birthDate.plus({ years: value }).toMillis();
      setAge(e.target.value);
      setDate(timestampToDateISOTZ(targetDateMs));
    }
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setDate(value);
      setAge("");
    } else {
      const birthDate = DateTime.fromMillis(patientDob, {
        zone: "America/Toronto",
      });
      const givenDate = DateTime.fromMillis(dateISOToTimestampTZ(value), {
        zone: "America/Toronto",
      });
      setAge(Math.floor(givenDate.diff(birthDate, "years").years));
      setDate(value);
    }
  };

  return (
    <div className="age-calculator">
      <form className="age-calculator__form">
        <div className="age-calculator__form-row">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={handleAgeChange}
            autoComplete="off"
            step="1"
            min="0"
          />
        </div>
        <div className="age-calculator__form-row">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={handleDateChange}
          />
        </div>
      </form>
    </div>
  );
};

export default AgeCalculatorPU;
