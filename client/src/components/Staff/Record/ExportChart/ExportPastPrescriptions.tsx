import React, { useEffect } from "react";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import { AttachmentType } from "../../../../types/api";
import DocumentEmbed from "./DocumentEmbed";

type ExportPastPrescriptionsProps = {
  patientId: number;
  prescriptionsFilesRef: React.MutableRefObject<AttachmentType[]>;
};

const ExportPastPrescriptions = ({
  patientId,
  prescriptionsFilesRef,
}: ExportPastPrescriptionsProps) => {
  //Queries
  const { data, isPending, error, fetchNextPage, hasNextPage } = useTopic(
    "PAST PRESCRIPTIONS",
    patientId
  );
  useFetchAllPages(fetchNextPage, hasNextPage);

  useEffect(() => {
    if (hasNextPage || !data) return;
    for (const item of data.pages.flatMap((page) => page.items)) {
      !prescriptionsFilesRef.current
        .map((file) => file.name)
        .includes(item.attachment.file.name) &&
        prescriptionsFilesRef.current.push(item.attachment.file);
    }
  }, [data, hasNextPage, prescriptionsFilesRef]);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const topicDatas = data.pages.flatMap((page) => page.items);

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
