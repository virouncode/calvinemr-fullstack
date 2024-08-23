import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import { ProblemListType, XanoPaginatedType } from "../../../../../types/api";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type ProblemListDropDownProps = {
  topicDatas:
    | InfiniteData<XanoPaginatedType<ProblemListType>, unknown>
    | undefined;
  isPending: boolean;
  error: Error | null;
};

const ProblemListDropDown = ({
  topicDatas,
  isPending,
  error,
}: ProblemListDropDownProps) => {
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
          {datas.slice(0, 4).map((item) => (
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
