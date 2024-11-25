import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import { ConsentFormType, XanoPaginatedType } from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import { showDocument } from "../../../../../utils/files/showDocument";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type ConsentFormsDropDownProps = {
  topicDatas:
    | InfiniteData<XanoPaginatedType<ConsentFormType>, unknown>
    | undefined;
  isPending: boolean;
  error: Error | null;
};

const ConsentFormsDropDown = ({
  topicDatas,
  isPending,
  error,
}: ConsentFormsDropDownProps) => {
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
            <li
              key={item.id}
              onClick={() => showDocument(item.file.url, item.file.mime)}
              className="topic-content__link"
            >
              - {item.name} ({timestampToDateISOTZ(item.date_created)})
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No Consent forms"
      )}
    </div>
  );
};

export default ConsentFormsDropDown;
