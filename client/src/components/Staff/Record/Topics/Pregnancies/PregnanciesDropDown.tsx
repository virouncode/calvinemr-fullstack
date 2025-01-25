import React from "react";
import { PregnancyType } from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";

type PregnanciesDropDownProps = {
  data: PregnancyType[];
};

const PregnanciesDropDown = ({ data }: PregnanciesDropDownProps) => {
  return (
    <div className="topic-content">
      {data && data.length >= 1 ? (
        <ul>
          {data.slice(0, 4).map((item) => (
            <li key={item.id} className="topic-content__item">
              - {item.description} ({timestampToDateISOTZ(item.date_of_event)})
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No pregnancies"
      )}
    </div>
  );
};

export default PregnanciesDropDown;
