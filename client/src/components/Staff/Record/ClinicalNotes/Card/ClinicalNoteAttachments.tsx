import React from "react";
import { ClinicalNoteAttachmentType } from "../../../../../types/api";
import ClinicalNoteAttachmentCard from "./ClinicalNoteAttachmentCard";

type ClinicalNoteAttachmentsProps = {
  patientId: number;
  attachments: ClinicalNoteAttachmentType[];
  deletable: boolean;
  handleRemoveAttachment?: (attachmentName: string) => void;
  addable?: boolean;
  date: number;
};

const ClinicalNoteAttachments = ({
  patientId,
  attachments,
  deletable,
  handleRemoveAttachment,
  addable,
  date,
}: ClinicalNoteAttachmentsProps) => {
  return (
    <div className="clinical-notes__attachments">
      {attachments && attachments.length > 0
        ? attachments.map((attachment) => (
            <ClinicalNoteAttachmentCard
              handleRemoveAttachment={handleRemoveAttachment}
              attachment={attachment}
              key={attachment.id}
              deletable={deletable}
              patientId={patientId}
              addable={addable}
              date={date}
            />
          ))
        : null}
    </div>
  );
};

export default ClinicalNoteAttachments;
