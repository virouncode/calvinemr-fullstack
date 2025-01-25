import React from "react";
import { ConsentFormType } from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import { showDocument } from "../../../../../utils/files/showDocument";

type ConsentFormsDropDownProps = {
  data: ConsentFormType[];
};

const ConsentFormsDropDown = ({ data }: ConsentFormsDropDownProps) => {
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
        "No Consent forms"
      )}
    </div>
  );
};

export default ConsentFormsDropDown;
