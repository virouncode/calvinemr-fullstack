import { useEffect } from "react";
import DocumentEmbed from "./DocumentEmbed";

const ExportLetters = ({ topicDatas, lettersFilesRef, hasNextPage }) => {
  useEffect(() => {
    if (hasNextPage) return;
    for (let item of topicDatas) {
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
