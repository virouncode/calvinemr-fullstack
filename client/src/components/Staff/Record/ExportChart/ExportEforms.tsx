import React, { useEffect } from "react";
import { AttachmentType, EformType } from "../../../../types/api";
import DocumentEmbed from "./DocumentEmbed";

type ExportEformsProps = {
  topicDatas: EformType[];
  eformsFilesRef: React.MutableRefObject<AttachmentType[]>;
  hasNextPage: boolean;
};

const ExportEforms = ({
  topicDatas,
  eformsFilesRef,
  hasNextPage,
}: ExportEformsProps) => {
  useEffect(() => {
    if (hasNextPage) return;
    for (const eform of topicDatas) {
      !eformsFilesRef.current
        .map((file) => file.name)
        .includes(eform.file.name) && eformsFilesRef.current.push(eform.file);
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
