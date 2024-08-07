import DaySheetEventCardHeader from "./DaySheetEventCardHeader";
import DayShettEventCardGuests from "./DayShettEventCardGuests";

const DaySheetEventCard = ({ event }) => {
  return (
    <div className="daysheet__event-card">
      <div className="daysheet__event-card-header">
        <DaySheetEventCardHeader event={event} />
      </div>
      <div className="daysheet__event-card-content">
        <DayShettEventCardGuests event={event} />
        <div>
          <strong>Host: </strong>
          {event.extendedProps.hostName}
        </div>
        <div>
          <strong>Site: </strong>
          {event.extendedProps.siteName}
        </div>
        <div>
          <strong>Room: </strong>
          {event.extendedProps.roomTitle}
        </div>
        <div>
          <strong>{event.extendedProps.status.toUpperCase()}</strong>
        </div>
        <div>
          <strong>Notes: </strong>
          {event.extendedProps.notes}
        </div>
      </div>
    </div>
  );
};

export default DaySheetEventCard;
