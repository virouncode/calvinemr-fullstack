import React from "react";
import { ReportType } from "../../../../types/api";

type ExportReportTextItemProps = {
  item: ReportType;
};

const ExportReportTextItem = ({ item }: ExportReportTextItemProps) => {
  return (
    <div style={{ padding: "30px" }}>
      <div style={{ fontWeight: "bold" }}>{item.name}</div>
      <div style={{ marginLeft: "20px", whiteSpace: "pre-wrap" }}>
        {item.Content?.TextContent}
      </div>
    </div>
  );
};

export default ExportReportTextItem;
