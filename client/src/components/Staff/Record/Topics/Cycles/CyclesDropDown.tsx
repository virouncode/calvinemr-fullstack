import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import { CycleType, XanoPaginatedType } from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type CycleDropDownProps = {
  topicDatas: InfiniteData<XanoPaginatedType<CycleType>, unknown> | undefined;
  isPending: boolean;
  error: Error | null;
};

const CycleDropDown = ({
  topicDatas,
  isPending,
  error,
}: CycleDropDownProps) => {
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
      {datas && datas.length >= 1 ? (
        <ul>
          {datas.slice(0, 4).map((item) => (
            <li key={item.id} className="topic-content__item">
              - Cycle number {item.cycle_nbr} ({item.cycle_type}, LMP:{" "}
              {timestampToDateISOTZ(item.lmp)})
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No cycles"
      )}
    </div>
  );
};

export default CycleDropDown;
