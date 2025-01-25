import React from "react";
import { FamilyHistoryType } from "../../../../../types/api";

type FamilyHistoryDropDownProps = {
  data: FamilyHistoryType[];
};

const FamilyHistoryDropDown = ({ data }: FamilyHistoryDropDownProps) => {
  return (
    <div className="topic-content">
      {data && data.length > 0 ? (
        <ul>
          {data.slice(0, 4).map((event) => (
            <li key={event.id} className="topic-content__item">
              - {event.ProblemDiagnosisProcedureDescription} (
              {event.Relationship})
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No family history"
      )}
    </div>
  );
};

export default FamilyHistoryDropDown;
