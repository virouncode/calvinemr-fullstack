import React, { useEffect } from "react";
import { AttachmentType, ReportType } from "../../../../types/api";
import DocumentEmbed from "./DocumentEmbed";
import ExportReportTextItem from "./ExportReportTextItem";

type ExportReportsProps = {
  topicDatas: ReportType[];
  reportsFilesRef: React.MutableRefObject<AttachmentType[]>;
  reportsTextRef: React.MutableRefObject<HTMLDivElement | null>;
  hasNextPage: boolean;
};

const ExportReports = ({
  topicDatas,
  reportsFilesRef,
  reportsTextRef,
  hasNextPage,
}: ExportReportsProps) => {
  useEffect(() => {
    if (hasNextPage) return;
    for (const item of topicDatas) {
      if (item.File) {
        item.Format === "Binary" &&
          !reportsFilesRef.current
            .map((file) => file.name)
            .includes(item.File.name) &&
          reportsFilesRef.current.push(item.File);
      }
    }
  }, [topicDatas, hasNextPage, reportsFilesRef]);
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
