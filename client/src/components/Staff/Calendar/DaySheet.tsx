import { EventInput } from "@fullcalendar/core";
import React from "react";
import { getTodaysEvents } from "../../../utils/appointments/occurences";
import { timestampToHumanDateYearTZ } from "../../../utils/dates/formatDates";
import Button from "../../UI/Buttons/Button";
import DaySheetEventCard from "./DaySheetEventCard";

type DaySheetProps = {
  events: EventInput[] | undefined;
  rangeStart: number;
  rangeEnd: number;
};

const DaySheet = ({ events, rangeStart, rangeEnd }: DaySheetProps) => {
  const handlePrint = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.nativeEvent.view?.print();
  };
  return (
    events && (
      <div className="calendar__daysheet">
        <div className="calendar__daysheet-btn">
          <Button onClick={handlePrint} label="Print" />
        </div>
        <div className="calendar__daysheet-date">
          {timestampToHumanDateYearTZ(rangeStart)}
        </div>
        {getTodaysEvents(events, rangeStart, rangeEnd)
          .sort((a, b) => (a.start as number) - (b.start as number))
          .map((event) => (
            <DaySheetEventCard event={event} key={event.id} />
          ))}
      </div>
    )
  );
};

export default DaySheet;
