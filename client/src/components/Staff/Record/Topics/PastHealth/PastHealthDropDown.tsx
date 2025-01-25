import React from "react";
import { PastHealthType } from "../../../../../types/api";

type PastHealthDropDownProps = {
  data: PastHealthType[];
};

const PastHealthDropDown = ({ data }: PastHealthDropDownProps) => {
  return (
    <div className="topic-content">
      {data && data.length > 0 ? (
        <ul>
          {data.slice(0, 4).map((item) => (
            <li key={item.id} className="topic-content__item">
              - {item.PastHealthProblemDescriptionOrProcedures}
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No past health"
      )}
    </div>
  );
};

export default PastHealthDropDown;
