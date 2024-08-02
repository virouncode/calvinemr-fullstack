
import { getTodaysEvents } from "../../../utils/appointments/occurences";
import { timestampToHumanDateYearTZ } from "../../../utils/dates/formatDates";
import DaySheetEventCard from "./DaySheetEventCard";

const DaySheet = ({ events, rangeStart, rangeEnd }) => {
  const handlePrint = (e) => {
    e.nativeEvent.view.print();
  };
  return (
    <div className="daysheet">
      <div className="daysheet__date">
        {timestampToHumanDateYearTZ(rangeStart)}
      </div>
      <div className="daysheet__btn-container">
        <button onClick={handlePrint}>Print</button>
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
