import { timestampToHumanTimeTZ } from "../../../utils/dates/formatDates";

const DaySheetEventCardHeader = ({ event }) => {
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
