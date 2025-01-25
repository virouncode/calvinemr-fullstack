import React from "react";
import { ReportType } from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import { showDocument } from "../../../../../utils/files/showDocument";
import { showReportTextContent } from "../../../../../utils/reports/showReportTextContent";

type ReportsDropDownProps = {
  reportsReceived: ReportType[];
  reportsSent: ReportType[];
};

const ReportsDropDown = ({
  reportsReceived,
  reportsSent,
}: ReportsDropDownProps) => {
  return (
    <div className="topic-content">
      {(reportsReceived && reportsReceived.length > 0) ||
      (reportsSent && reportsSent.length > 0) ? (
        <>
          <p style={{ fontWeight: "bold" }}>Received</p>
          <ul>
            {reportsReceived
              ?.filter(({ acknowledged }) => !acknowledged)
              .slice(0, 3)
              .map((item) => (
                <li
                  key={item.id}
                  onClick={() =>
                    item.File
                      ? showDocument(item.File?.url, item.File?.mime)
                      : showReportTextContent(item)
                  }
                  style={{
                    textDecoration: "underline",
                    color: "#327AE6",
                    cursor: "pointer",
                  }}
                  className="topic-content__item"
                >
                  - {item.name} ({timestampToDateISOTZ(item.date_created)})
                </li>
              ))}
            {reportsReceived
              ?.filter(({ acknowledged }) => acknowledged)
              .slice(0, 3)
              .map((item) => (
                <li
                  key={item.id}
                  onClick={() =>
                    item.File
                      ? showDocument(item.File?.url, item.File?.mime)
                      : showReportTextContent(item)
                  }
                  style={{
                    textDecoration: "underline",
                    color: "black",
                    cursor: "pointer",
                    fontWeight: "normal",
                  }}
                  className="topic-content__item"
                >
                  - {item.name} ({timestampToDateISOTZ(item.date_created)})
                </li>
              ))}
            <li>...</li>
          </ul>
          <p style={{ fontWeight: "bold", marginTop: "10px" }}>Sent</p>
          <ul>
            {reportsSent
              ?.filter(({ File }) => File)
              .slice(0, 3)
              .map((item) => (
                <li
                  key={item.id}
                  onClick={() =>
                    item.File
                      ? showDocument(item.File?.url, item.File?.mime)
                      : showReportTextContent(item)
                  }
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  className="topic-content__item"
                >
                  - {item.name} ({timestampToDateISOTZ(item.date_created)})
                </li>
              ))}
            <li>...</li>
          </ul>
        </>
      ) : (
        "No reports"
      )}
    </div>
  );
};

export default ReportsDropDown;
