import React, { useEffect } from "react";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import { AttachmentType } from "../../../../types/api";
import DocumentEmbed from "./DocumentEmbed";

type ExportEformsProps = {
  eformsFilesRef: React.MutableRefObject<AttachmentType[]>;
  patientId: number;
};

const ExportEforms = ({ eformsFilesRef, patientId }: ExportEformsProps) => {
  //Queries
  const { data, isPending, error, fetchNextPage, hasNextPage } = useTopic(
    "E-FORMS",
    patientId
  );
  useFetchAllPages(fetchNextPage, hasNextPage);

  useEffect(() => {
    if (hasNextPage || !data) return;
    for (const eform of data.pages.flatMap((page) => page.items)) {
      !eformsFilesRef.current
        .map((file) => file.name)
        .includes(eform.file.name) && eformsFilesRef.current.push(eform.file);
    }
  }, [data, hasNextPage, eformsFilesRef]);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const topicDatas = data.pages.flatMap((page) => page.items);

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
