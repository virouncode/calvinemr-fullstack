import React, { useState } from "react";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
  toDayOfCycle,
  todayTZTimestamp,
} from "../../../../../utils/dates/formatDates";
import InputDate from "../../../../UI/Inputs/InputDate";

type CycleCalculatorPopUpProps = {
  patientDob: number;
};

const CycleCalculatorPopUp = ({ patientDob }: CycleCalculatorPopUpProps) => {
  //Hooks
  const [lmp, setLmp] = useState(todayTZTimestamp());
  const [today, setToday] = useState(todayTZTimestamp());

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (!value) return;
    switch (name) {
      case "lmp":
        setLmp(dateISOToTimestampTZ(value) as number);
        break;
      case "today":
        setToday(dateISOToTimestampTZ(value) as number);
        break;
    }
  };

  return (
    <div className="cycle-calculator">
      <h1 className="cycle-calculator__title">Cycle Day Calculator</h1>
      <form className="cycle-calculator__form">
        <div className="cycle-calculator__form-row">
          <InputDate
            value={timestampToDateISOTZ(lmp)}
            onChange={handleDateChange}
            id="lmp"
            label="First Day of Last Menstrual Period"
            name="lmp"
          />
        </div>
        <div className="cycle-calculator__form-row">
          <InputDate
            value={timestampToDateISOTZ(today)}
            onChange={handleDateChange}
            id="today"
            label="Today"
            name="today"
          />
        </div>
        <div className="cycle-calculator__form-row cycle-calculator__form-row--result">
          <label>Day of cycle</label>
          <p>{toDayOfCycle(today, lmp)}</p>
        </div>
      </form>
    </div>
  );
};

export default CycleCalculatorPopUp;
