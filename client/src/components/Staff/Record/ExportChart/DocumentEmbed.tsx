import React from "react";

type DocumentEmbedProps = {
  docUrl: string;
};

const DocumentEmbed = ({ docUrl }: DocumentEmbedProps) => {
  return (
    <div style={{ width: "100%", height: "800px" }}>
      <object data={docUrl} type="application/pdf" width="100%" height="100%">
        <p>
          Your browser does not support PDFs.{" "}
          <a href={docUrl}>Download the PDF</a>.
        </p>
      </object>
    </div>
  );
};

export default DocumentEmbed;
