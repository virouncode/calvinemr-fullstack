import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import { PregnancyType, XanoPaginatedType } from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type PregnanciesDropDownProps = {
  topicDatas:
    | InfiniteData<XanoPaginatedType<PregnancyType>, unknown>
    | undefined;
  isPending: boolean;
  error: Error | null;
};

const PregnanciesDropDown = ({
  topicDatas,
  isPending,
  error,
}: PregnanciesDropDownProps) => {
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
              - {item.description} ({timestampToDateISOTZ(item.date_of_event)})
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No pregnancies"
      )}
    </div>
  );
};

export default PregnanciesDropDown;
