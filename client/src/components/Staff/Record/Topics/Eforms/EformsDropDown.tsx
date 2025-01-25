import React from "react";
import { EformType } from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import { showDocument } from "../../../../../utils/files/showDocument";

type EformsDropDownProps = {
  data: EformType[];
};

const EformsDropDown = ({ data }: EformsDropDownProps) => {
  return (
    <div className="topic-content">
      {data && data.length > 0 ? (
        <ul>
          {data.slice(0, 4).map((item) => (
            <li
              key={item.id}
              onClick={() => showDocument(item.file.url, item.file.mime)}
              className="topic-content__link"
            >
              - {item.name} ({timestampToDateISOTZ(item.date_created)})
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No E-forms"
      )}
    </div>
  );
};

export default EformsDropDown;
