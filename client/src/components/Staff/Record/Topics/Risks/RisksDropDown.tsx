import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import { RiskFactorType, XanoPaginatedType } from "../../../../../types/api";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type RisksDropDownProps = {
  topicDatas:
    | InfiniteData<XanoPaginatedType<RiskFactorType>, unknown>
    | undefined;
  isPending: boolean;
  error: Error | null;
};

const RisksDropDown = ({
  topicDatas,
  isPending,
  error,
}: RisksDropDownProps) => {
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
              - {item.RiskFactor}
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No risk factors"
      )}
    </div>
  );
};

export default RisksDropDown;
