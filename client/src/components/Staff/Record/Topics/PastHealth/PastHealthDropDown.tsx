import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import { PastHealthType, XanoPaginatedType } from "../../../../../types/api";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type PastHealthDropDownProps = {
  topicDatas:
    | InfiniteData<XanoPaginatedType<PastHealthType>, unknown>
    | undefined;
  isPending: boolean;
  error: Error | null;
};

const PastHealthDropDown = ({
  topicDatas,
  isPending,
  error,
}: PastHealthDropDownProps) => {
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
