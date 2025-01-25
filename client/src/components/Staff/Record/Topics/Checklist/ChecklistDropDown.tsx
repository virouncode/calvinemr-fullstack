import React from "react";
import { ChecklistType } from "../../../../../types/api";
import {
  isTestExpired,
  splitChecklistResults,
} from "../../../../../utils/checklist/checklistUtils";

type ChecklistDropDownProps = {
  data: ChecklistType[];
};

const ChecklistDropDown = ({ data }: ChecklistDropDownProps) => {
  const splittedChecklistResults = splitChecklistResults(
    data as ChecklistType[]
  );
  const lastChecklistResults = splittedChecklistResults.map(
    (result) => result[0]
  );

  return (
    <div className="topic-content">
      {data && data.length > 0 ? (
        <ul>
          {lastChecklistResults.map(
            (result) =>
              result && (
                <li
                  key={result.id}
                  className="topic-content__item"
                  style={{
                    color:
                      isTestExpired(result.date, result.validity) === "Y"
                        ? "red"
                        : "green",
                  }}
                >
                  - {result.test_name} : {result.result}
                </li>
              )
          )}
        </ul>
      ) : (
        "No results"
      )}
    </div>
  );
};

export default ChecklistDropDown;
