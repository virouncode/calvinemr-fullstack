import { DateTime } from "luxon";


const LetterDate = ({ date }) => {
  return (
    <div className="letter__date">
      <p>
        Date:{" "}
        {date &&
          DateTime.fromISO(date, {
            zone: "America/Toronto",
            locale: "en-CA",
          }).toLocaleString({
            month: "long",
            day: "2-digit",
            year: "numeric",
          })}
      </p>
    </div>
  );
};

export default LetterDate;
