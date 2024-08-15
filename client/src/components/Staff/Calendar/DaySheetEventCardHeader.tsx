import React from "react";
import { EventType } from "../../../types/app";
import { timestampToHumanTimeTZ } from "../../../utils/dates/formatDates";

type DaySheetEventCardHeaderProps = {
  event: EventType;
};

const DaySheetEventCardHeader = ({ event }: DaySheetEventCardHeaderProps) => {
  return (
    <div>
      {!event.allDay ? (
        <span>
          {timestampToHumanTimeTZ(event.start)}
          {" - "}
          {timestampToHumanTimeTZ(event.end)}
        </span>
      ) : (
        <span>All day</span>
      )}
      {" : "}
      {event.extendedProps.purpose ?? "Appointment"}
    </div>
  );
};

export default DaySheetEventCardHeader;
