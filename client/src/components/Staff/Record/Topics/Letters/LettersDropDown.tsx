import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import { LetterType, XanoPaginatedType } from "../../../../../types/api";
import { showDocument } from "../../../../../utils/files/showDocument";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type LettersDropDownProps = {
  topicDatas: InfiniteData<XanoPaginatedType<LetterType>, unknown> | undefined;
  isPending: boolean;
  error: Error | null;
};

const LettersDropDown = ({
  topicDatas,
  isPending,
  error,
}: LettersDropDownProps) => {
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
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => showDocument(item.file?.url, "pdf")}
              className="topic-content__item"
            >
              - {item.name}
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No letters"
      )}
    </div>
  );
};

export default LettersDropDown;
