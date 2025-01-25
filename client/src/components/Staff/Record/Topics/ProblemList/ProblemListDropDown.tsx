import React from "react";
import { ProblemListType } from "../../../../../types/api";

type ProblemListDropDownProps = {
  data: ProblemListType[];
};

const ProblemListDropDown = ({ data }: ProblemListDropDownProps) => {
  return (
    <div className="topic-content">
      {data && data.length > 0 ? (
        <ul>
          {data.slice(0, 4).map((item) => (
            <li key={item.id} className="topic-content__item">
              - {item.ProblemDiagnosisDescription}
              {", "}
              {item.ProblemDescription}
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No problems"
      )}
    </div>
  );
};

export default ProblemListDropDown;
