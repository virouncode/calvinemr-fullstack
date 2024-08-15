import React from "react";
import { AttachmentType } from "../../../types/api";

type ReportViewerProps = {
  file: AttachmentType;
};
const ReportViewer = ({ file }: ReportViewerProps) => {
  return file && file.mime?.includes("image") ? (
    <img
      src={`${import.meta.env.VITE_XANO_BASE_URL}${file.path}`}
      alt=""
      width="100%"
    />
  ) : file && file.mime?.includes("video") ? (
    <video controls>
      <source
        src={`${import.meta.env.VITE_XANO_BASE_URL}${file.path}`}
        type={file.mime}
      />
    </video>
  ) : file && file.mime?.includes("officedocument") ? (
    <div>
      <iframe
        title="report-view"
        src={`https://docs.google.com/gview?url=${
          import.meta.env.VITE_XANO_BASE_URL
        }${file.path}&embedded=true&widget=false`}
        width="100%"
        height="700px"
      />
    </div>
  ) : (
    file && (
      <iframe
        title="report-view"
        src={`${import.meta.env.VITE_XANO_BASE_URL}${file.path}`}
        width="100%"
        style={{ border: "none" }}
        height="700px"
      />
    )
  );
};

export default ReportViewer;
