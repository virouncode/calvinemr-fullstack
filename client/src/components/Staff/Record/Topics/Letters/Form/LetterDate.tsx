import { DateTime } from "luxon";
import React from "react";

type LetterDateProps = {
  dateStr: string;
};

const LetterDate = ({ dateStr }: LetterDateProps) => {
  return (
    <div className="letter__date">
      <p>
        Date:{" "}
        {dateStr &&
          DateTime.fromISO(dateStr, {
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
