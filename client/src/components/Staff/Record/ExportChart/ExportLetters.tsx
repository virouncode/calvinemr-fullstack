import React, { useEffect } from "react";
import { AttachmentType, LetterType } from "../../../../types/api";
import DocumentEmbed from "./DocumentEmbed";

type ExportLettersProps = {
  topicDatas: LetterType[];
  lettersFilesRef: React.MutableRefObject<AttachmentType[]>;
  hasNextPage: boolean;
};

const ExportLetters = ({
  topicDatas,
  lettersFilesRef,
  hasNextPage,
}: ExportLettersProps) => {
  useEffect(() => {
    if (hasNextPage) return;
    for (const item of topicDatas) {
      !lettersFilesRef.current
        .map((file) => file.name)
        .includes(item.file.name) && lettersFilesRef.current.push(item.file);
    }
  }, [topicDatas, hasNextPage, lettersFilesRef]);
  return (
    <div className="export__card">
      <p className="export__title" style={{ backgroundColor: "#848484" }}>
        LETTERS/REFERRALS
      </p>
      <div className="export__content">
        {topicDatas.length > 0
          ? topicDatas.map((item) => (
              <DocumentEmbed docUrl={item.file?.url} key={item.id} />
            ))
          : "No past prescriptions"}
      </div>
    </div>
  );
};

export default ExportLetters;
