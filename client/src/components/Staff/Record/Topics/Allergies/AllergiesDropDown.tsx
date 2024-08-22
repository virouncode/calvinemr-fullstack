import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import { AllergyType, XanoPaginatedType } from "../../../../../types/api";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type AllergiesDropDownProps = {
  topicDatas: InfiniteData<XanoPaginatedType<AllergyType>, unknown> | undefined;
  isPending: boolean;
  error: Error | null;
};

const AllergiesDropDown = ({
  topicDatas,
  isPending,
  error,
}: AllergiesDropDownProps) => {
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
              - {item.OffendingAgentDescription}
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No allergies"
      )}
    </div>
  );
};

export default AllergiesDropDown;
