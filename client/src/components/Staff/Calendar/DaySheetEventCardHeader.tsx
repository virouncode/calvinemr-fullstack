import { EventInput } from "@fullcalendar/core";
import React from "react";
import { timestampToHumanTimeTZ } from "../../../utils/dates/formatDates";

type DaySheetEventCardHeaderProps = {
  event: EventInput;
};

const DaySheetEventCardHeader = ({ event }: DaySheetEventCardHeaderProps) => {
  return (
    <div>
      {!event.allDay ? (
        <span>
          {timestampToHumanTimeTZ(event.start as number)}
          {" - "}
          {timestampToHumanTimeTZ(event.end as number)}
        </span>
      ) : (
        <span>All day</span>
      )}
      {" : "}
      {event.extendedProps?.purpose ?? "Appointment"}
    </div>
  );
};

export default DaySheetEventCardHeader;
