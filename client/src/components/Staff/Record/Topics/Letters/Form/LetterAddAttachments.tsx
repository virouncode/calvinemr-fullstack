import React from "react";
import { LetterAttachmentType } from "../../../../../../types/api";
import PaperclipIcon from "../../../../../UI/Icons/PaperclipIcon";
import TrashIcon from "../../../../../UI/Icons/TrashIcon";
import CircularProgressSmall from "../../../../../UI/Progress/CircularProgressSmall";

type LetterAddAttachmentsProps = {
  handleAttach: () => void;
  isLoadingFile: boolean;
  attachments: LetterAttachmentType[];
  handleRemoveAttachment: (alias: string) => void;
};

const LetterAddAttachments = ({
  handleAttach,
  isLoadingFile,
  attachments,
  handleRemoveAttachment,
}: LetterAddAttachmentsProps) => {
  return (
    <div className="letter__options-attachments">
      <div className="letter__options-attachments-title">
        Add attachments
        <PaperclipIcon onClick={handleAttach} ml={5} />
        {isLoadingFile && <CircularProgressSmall />}
        <div>
          {attachments
            .filter(({ type }) => type === "attachment")
            .map((attachment) => (
              <span
                key={attachment.alias}
                style={{
                  marginLeft: "5px",
                  fontWeight: "normal",
                  fontSize: "0.75rem",
                }}
              >
                {attachment.alias}{" "}
                <TrashIcon
                  onClick={() => handleRemoveAttachment(attachment.alias)}
                  ml={5}
                />
                ,
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LetterAddAttachments;
