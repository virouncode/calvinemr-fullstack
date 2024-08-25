import React from "react";
import {
  ClinicalNoteAttachmentType,
  MessageAttachmentType,
} from "../../../types/api";
import PaperclipIcon from "../Icons/PaperclipIcon";

type AttachFilesButtonProps = {
  onClick: () => void;
  attachments: Partial<MessageAttachmentType | ClinicalNoteAttachmentType>[];
};

const AttachFilesButton = ({
  onClick,
  attachments,
}: AttachFilesButtonProps) => {
  return (
    <>
      <label>Attach files</label>
      <PaperclipIcon onClick={onClick} ml={5} />
      {attachments.map((attachment) => (
        <span key={attachment.file?.name} style={{ marginLeft: "5px" }}>
          {attachment.alias},
        </span>
      ))}
    </>
  );
};

export default AttachFilesButton;
