import { useEffect } from "react";
import DocumentEmbed from "./DocumentEmbed";

const ExportPastPrescriptions = ({
  topicDatas,
  prescriptionsFilesRef,
  hasNextPage,
}) => {
  useEffect(() => {
    if (hasNextPage) return;
    for (let item of topicDatas) {
      !prescriptionsFilesRef.current
        .map((file) => file.name)
        .includes(item.attachment.file.name) &&
        prescriptionsFilesRef.current.push(item.attachment.file);
    }
  }, [topicDatas, hasNextPage, prescriptionsFilesRef]);
  return (
    <div className="export__card">
      <p className="export__title" style={{ backgroundColor: "#E3AFCD" }}>
        PAST PRESCRIPTIONS
      </p>
      <div className="export__content">
        {topicDatas.length > 0
          ? topicDatas.map((item) => (
              <DocumentEmbed docUrl={item.attachment.file.url} key={item.id} />
            ))
          : "No past prescriptions"}
      </div>
    </div>
  );
};

export default ExportPastPrescriptions;
