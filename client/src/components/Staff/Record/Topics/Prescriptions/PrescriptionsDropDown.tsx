import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import { PrescriptionType, XanoPaginatedType } from "../../../../../types/api";
import { showDocument } from "../../../../../utils/files/showDocument";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type PrescriptionsDropDownProps = {
  topicDatas:
    | InfiniteData<XanoPaginatedType<PrescriptionType>, unknown>
    | undefined;
  isPending: boolean;
  error: Error | null;
};

const PrescriptionsDropDown = ({
  topicDatas,
  isPending,
  error,
}: PrescriptionsDropDownProps) => {
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
            <li
              key={item.id}
              onClick={() =>
                showDocument(
                  item.attachment.file.url,
                  item.attachment.file.mime
                )
              }
              className="topic-content__item"
              style={{
                textDecoration: "underline",
                color: "#327AE6",
                cursor: "pointer",
              }}
            >
              - {item.attachment.alias}
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No past prescriptions"
      )}
    </div>
  );
};

export default PrescriptionsDropDown;
