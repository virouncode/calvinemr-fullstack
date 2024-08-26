import React from "react";
import { AttachmentType } from "../../../types/api";

type ReportViewerProps = {
  file: AttachmentType;
};

const ReportViewer = ({ file }: ReportViewerProps) => {
  if (!file) return null;

  const baseUrl = import.meta.env.VITE_XANO_BASE_URL;
  const fileUrl = `${baseUrl}${file.path}`;

  const renderContent = () => {
    if (file.mime?.includes("image")) {
      return <img src={fileUrl} alt="Image preview" width="100%" />;
    }

    if (file.mime?.includes("video")) {
      return (
        <video controls width="100%">
          <source src={fileUrl} type={file.mime} />
        </video>
      );
    }

    if (file.mime?.includes("officedocument")) {
      return (
        <iframe
          title="Office document viewer"
          src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true&widget=false`}
          width="100%"
          height="700px"
          style={{ border: "none" }}
        />
      );
    }

    // Default case for other file types
    return (
      <iframe
        title="File viewer"
        src={fileUrl}
        width="100%"
        height="700px"
        style={{ border: "none" }}
      />
    );
  };

  return <>{renderContent()}</>;
};

export default ReportViewer;
