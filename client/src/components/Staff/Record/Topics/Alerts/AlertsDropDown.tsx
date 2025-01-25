import React from "react";
import { AlertType } from "../../../../../types/api";

type AlertsDropDownProps = {
  data: AlertType[];
};

const AlertsDropDown = ({ data }: AlertsDropDownProps) => {
  return (
    <div className="topic-content">
      {data && data.length > 0 ? (
        <ul>
          {data.slice(0, 4).map((item) => (
            <li key={item.id} className="topic-content__item">
              - {item.AlertDescription}
              {item.Notes ? `: ${item.Notes}` : null}
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No alerts"
      )}
    </div>
  );
};

export default AlertsDropDown;
