import { nowTZ } from "../../../utils/dates/formatDates";
import ArrowLeftIcon from "../../UI/Icons/ArrowLeftIcon";
import ArrowRightIcon from "../../UI/Icons/ArrowRightIcon";

const WeekPicker = ({ handleClickNext, handleClickPrevious, rangeStart }) => {
  return (
    <div className="new-appointments__content-weekpicker">
      <button
        onClick={handleClickPrevious}
        disabled={
          rangeStart === nowTZ().plus({ days: 1 }).startOf("day").toMillis()
        }
      >
        <ArrowLeftIcon clickable={false} />
      </button>
      <label>Change week</label>
      <button onClick={handleClickNext}>
        <ArrowRightIcon clickable={false} />
      </button>
    </div>
  );
};

export default WeekPicker;
