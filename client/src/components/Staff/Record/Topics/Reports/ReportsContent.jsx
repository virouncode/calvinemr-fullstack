import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import { showDocument } from "../../../../../utils/files/showDocument";
import { showReportTextContent } from "../../../../../utils/reports/showReportTextContent";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const ReportsContent = ({
  reportsReceived,
  isPendingReportsReceived,
  errorReportsReceived,
  reportsSent,
  isPendingReportsSent,
  errorReportsSent,
}) => {
  if (isPendingReportsReceived || isPendingReportsSent)
    return (
      <div className="topic-content">
        <CircularProgressMedium />
      </div>
    );
  if (errorReportsReceived || errorReportsSent)
    return (
      <div className="topic-content">
        <ErrorParagraph
          errorMsg={errorReportsReceived?.message || errorReportsSent?.message}
        />
      </div>
    );
  const datasReportsReceived = reportsReceived.pages.flatMap(
    (page) => page.items
  );
  const datasReportsSent = reportsSent.pages.flatMap((page) => page.items);

  return (
    <div className="topic-content">
      {(datasReportsReceived && datasReportsReceived.length > 0) ||
      (datasReportsSent && datasReportsSent.length > 0) ? (
        <>
          <p style={{ fontWeight: "bold" }}>Received</p>
          <ul>
            {datasReportsReceived
              .filter(({ acknowledged }) => !acknowledged)
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
            {datasReportsReceived
              .filter(({ acknowledged }) => acknowledged)
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
            {datasReportsSent
              .filter(({ File }) => File)
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

export default ReportsContent;
