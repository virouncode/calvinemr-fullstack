import { ReportType } from "../../types/api";

export const showReportTextContent = (report: ReportType) => {
  const textToShow = report?.Content?.TextContent || "";
  const newWindow = window.open("", "", "width=600,height=400");
  if (!newWindow) {
    // Handle the error case when newWindow is null
    alert(
      "Unable to open the report in a new window. Please check your browser settings."
    );
    return;
  }
  newWindow.document.write(`<!DOCTYPE html>
    <html>
    <head><
      <title>${report.name}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          white-space: pre-wrap;
          padding:0 20px;
        }
      </style>
    </head>
    <body>
      <h3>Report: ${report.name}</h3>
      <p>${textToShow}</p>
    </body>
    </html>`);
};
