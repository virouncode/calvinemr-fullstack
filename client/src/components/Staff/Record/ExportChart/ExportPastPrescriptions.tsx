import React, { useEffect } from "react";
import { AttachmentType, PrescriptionType } from "../../../../types/api";
import DocumentEmbed from "./DocumentEmbed";

type ExportPastPrescriptionsProps = {
  topicDatas: PrescriptionType[];
  prescriptionsFilesRef: React.MutableRefObject<AttachmentType[]>;
  hasNextPage: boolean;
};

const ExportPastPrescriptions = ({
  topicDatas,
  prescriptionsFilesRef,
  hasNextPage,
}: ExportPastPrescriptionsProps) => {
  useEffect(() => {
    if (hasNextPage) return;
    for (const item of topicDatas) {
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
