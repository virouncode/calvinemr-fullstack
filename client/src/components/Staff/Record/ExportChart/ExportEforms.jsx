import { useEffect } from "react";
import DocumentEmbed from "./DocumentEmbed";

const ExportEforms = ({ topicDatas, eformsFilesRef, hasNextPage }) => {
  useEffect(() => {
    if (hasNextPage) return;
    for (let item of topicDatas) {
      !eformsFilesRef.current
        .map((file) => file.name)
        .includes(item.file.name) && eformsFilesRef.current.push(item.file);
    }
  }, [topicDatas, hasNextPage, eformsFilesRef]);
  return (
    <div className="export__card">
      <p className="export__title" style={{ backgroundColor: "#29CBD6" }}>
        E-FORMS
      </p>
      <div className="export__content">
        {topicDatas.length > 0
          ? topicDatas.map((item) => (
              <DocumentEmbed docUrl={item.file?.url} key={item.id} />
            ))
          : "No e-forms"}
      </div>
    </div>
  );
};

export default ExportEforms;
