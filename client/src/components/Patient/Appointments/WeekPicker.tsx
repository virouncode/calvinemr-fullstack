import React from "react";
import { nowTZ } from "../../../utils/dates/formatDates";
import ArrowLeftIcon from "../../UI/Icons/ArrowLeftIcon";
import ArrowRightIcon from "../../UI/Icons/ArrowRightIcon";

type WeekPickerProps = {
  handleClickNext: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleClickPrevious: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  rangeStart: number;
};

const WeekPicker = ({
  handleClickNext,
  handleClickPrevious,
  rangeStart,
}: WeekPickerProps) => {
  return (
    <div className="patient-appointments__new-weekpicker">
      <button
        type="button"
        onClick={handleClickPrevious}
        disabled={
          rangeStart === nowTZ().plus({ days: 1 }).startOf("day").toMillis()
        }
        className="btn"
      >
        <ArrowLeftIcon clickable={false} />
      </button>
      <label>Change week</label>
      <button type="button" onClick={handleClickNext} className="btn">
        <ArrowRightIcon clickable={false} />
      </button>
    </div>
  );
};

export default WeekPicker;
