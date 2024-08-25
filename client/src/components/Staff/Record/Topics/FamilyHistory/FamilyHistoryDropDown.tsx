import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import { FamilyHistoryType, XanoPaginatedType } from "../../../../../types/api";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type FamilyHistoryDropDownProps = {
  topicDatas:
    | InfiniteData<XanoPaginatedType<FamilyHistoryType>, unknown>
    | undefined;
  isPending: boolean;
  error: Error | null;
};

const FamilyHistoryDropDown = ({
  topicDatas,
  isPending,
  error,
}: FamilyHistoryDropDownProps) => {
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
  return (
    <div className="topic-content">
      {datas && datas.length > 0 ? (
        <ul>
          {datas.slice(0, 4).map((event) => (
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
