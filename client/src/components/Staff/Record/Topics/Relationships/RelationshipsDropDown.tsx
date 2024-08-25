import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import { NavLink } from "react-router-dom";
import { RelationshipType, XanoPaginatedType } from "../../../../../types/api";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type RelationshipsDropDownProps = {
  topicDatas:
    | InfiniteData<XanoPaginatedType<RelationshipType>, unknown>
    | undefined;
  isPending: boolean;
  error: Error | null;
};

const RelationshipsDropDown = ({
  topicDatas,
  isPending,
  error,
}: RelationshipsDropDownProps) => {
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
              - {item.relationship} of{" "}
              <NavLink
                to={`/staff/patient-record/${item.relation_id}`}
                className="topic-content__link"
              >
                {toPatientName(item.relation_infos)}
              </NavLink>
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No relationships"
      )}
    </div>
  );
};

export default RelationshipsDropDown;
