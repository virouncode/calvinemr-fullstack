import React from "react";
import { EventType } from "../../../types/app";
import { getTodaysEvents } from "../../../utils/appointments/occurences";
import { timestampToHumanDateYearTZ } from "../../../utils/dates/formatDates";
import Button from "../../UI/Buttons/Button";
import DaySheetEventCard from "./DaySheetEventCard";

type DaySheetProps = {
  events: EventType[];
  rangeStart: number;
  rangeEnd: number;
};

const DaySheet = ({ events, rangeStart, rangeEnd }: DaySheetProps) => {
  const handlePrint = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.nativeEvent.view?.print();
  };
  return (
    <div className="daysheet">
      <div className="daysheet__date">
        {timestampToHumanDateYearTZ(rangeStart)}
      </div>
      <div className="daysheet__btn-container">
        <Button onClick={handlePrint} label="Print" />
      </div>
      {getTodaysEvents(events, rangeStart, rangeEnd)
        .sort((a, b) => a.start - b.start)
        .map((event) => (
          <DaySheetEventCard event={event} key={event.id} />
        ))}
    </div>
  );
};

export default DaySheet;
