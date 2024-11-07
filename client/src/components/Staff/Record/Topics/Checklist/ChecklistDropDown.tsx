import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import { ChecklistType, XanoPaginatedType } from "../../../../../types/api";
import { isTestExpired } from "../../../../../utils/checklist/checklistUtils";
import { splitResults } from "../../../../../utils/checklist/splitResults";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type ChecklistDropDownProps = {
  topicDatas:
    | InfiniteData<XanoPaginatedType<ChecklistType>, unknown>
    | undefined;
  isPending: boolean;
  error: Error | null;
};

const ChecklistDropDown = ({
  topicDatas,
  isPending,
  error,
}: ChecklistDropDownProps) => {
  if (isPending)
    return (
      <div className="topic-content">
        <CircularProgressMedium />
      </div>
    );
  if (error)
    return (
      <div className="topic-content">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  const datas = topicDatas?.pages.flatMap((page) => page.items);
  const splittedResults = splitResults(datas as ChecklistType[]);
  const lastResults = splittedResults.map((result) => result[0]);

  return (
    <div className="topic-content">
      {datas && datas.length > 0 ? (
        <ul>
          {lastResults.map(
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
