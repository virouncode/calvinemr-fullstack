import React, { useEffect } from "react";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import { AttachmentType } from "../../../../types/api";
import DocumentEmbed from "./DocumentEmbed";

type ExportLettersProps = {
  lettersFilesRef: React.MutableRefObject<AttachmentType[]>;
  patientId: number;
};

const ExportLetters = ({ lettersFilesRef, patientId }: ExportLettersProps) => {
  //Queries
  const { data, isPending, error, fetchNextPage, hasNextPage } = useTopic(
    "LETTERS/REFERRALS",
    patientId
  );
  useFetchAllPages(fetchNextPage, hasNextPage);

  useEffect(() => {
    if (hasNextPage || !data) return;
    for (const item of data.pages.flatMap((page) => page.items)) {
      !lettersFilesRef.current
        .map((file) => file.name)
        .includes(item.file.name) && lettersFilesRef.current.push(item.file);
    }
  }, [data, hasNextPage, lettersFilesRef]);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const topicDatas = data.pages.flatMap((page) => page.items);
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
