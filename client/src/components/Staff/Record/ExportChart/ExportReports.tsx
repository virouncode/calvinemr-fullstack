import React, { useEffect } from "react";
import { useReports } from "../../../../hooks/reactquery/queries/reportsQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import { AttachmentType } from "../../../../types/api";
import DocumentEmbed from "./DocumentEmbed";
import ExportReportTextItem from "./ExportReportTextItem";

type ExportReportsProps = {
  reportsFilesRef: React.MutableRefObject<AttachmentType[]>;
  reportsTextRef: React.MutableRefObject<HTMLDivElement | null>;
  patientId: number;
};

const ExportReports = ({
  reportsFilesRef,
  reportsTextRef,
  patientId,
}: ExportReportsProps) => {
  //Queries
  const { data, isPending, error, fetchNextPage, hasNextPage } =
    useReports(patientId);

  useFetchAllPages(fetchNextPage, hasNextPage);

  useEffect(() => {
    if (hasNextPage || !data) return;
    for (const item of data.pages.flatMap((page) => page.items)) {
      if (item.File) {
        item.Format === "Binary" &&
          !reportsFilesRef.current
            .map((file) => file.name)
            .includes(item.File.name) &&
          reportsFilesRef.current.push(item.File);
      }
    }
  }, [data, hasNextPage, reportsFilesRef]);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const topicDatas = data.pages.flatMap((page) => page.items);
  const reportsText = topicDatas.filter((item) => item.Format === "Text");
  const reportsBinary = topicDatas.filter((item) => item.Format === "Binary");

  return (
    <div className="export__card">
      <p className="export__title" style={{ backgroundColor: "#931621" }}>
        REPORTS
      </p>
      <div
        className="export__content"
        ref={reportsTextRef}
        style={{ padding: "40px 10px" }}
      >
        <p
          style={{
            fontWeight: "bold",
            fontSize: "0.9rem",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          Text reports
        </p>
        {reportsText.length > 0
          ? reportsText.map((item) => (
              <ExportReportTextItem item={item} key={item.id} />
            ))
          : "No text reports"}
      </div>
      <div className="export__content">
        <p
          style={{
            fontWeight: "bold",
            fontSize: "0.9rem",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          File reports
        </p>
        {reportsBinary.length > 0
          ? reportsBinary.map((item) => (
              <DocumentEmbed docUrl={item.File?.url ?? ""} key={item.id} />
            ))
          : "No file reports"}
      </div>
    </div>
  );
};

export default ExportReports;
