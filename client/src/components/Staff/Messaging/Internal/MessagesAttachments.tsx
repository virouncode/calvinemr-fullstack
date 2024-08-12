import React from "react";
import {
  MessageAttachmentType,
  MessageExternalType,
  MessageType,
} from "../../../../types/api";
import MessageAttachmentCard from "./MessageAttachmentCard";

//used in Messages and PatientMessages
type MessageAttachmentsProps = {
  attachments: MessageAttachmentType[];
  deletable?: boolean;
  addable?: boolean;
  cardWidth?: string;
  handleRemoveAttachment?: (attachmentName: string) => void;
  patientName?: string;
  message?: MessageType | MessageExternalType;
  hasRelatedPatient?: boolean;
};

const MessagesAttachments = ({
  attachments,
  deletable,
  addable,
  cardWidth,
  handleRemoveAttachment,
  patientName,
  message,
  hasRelatedPatient = false,
}: MessageAttachmentsProps) => {
  return (
    attachments && (
      <div className="message-attachments">
        {attachments.map((attachment) => (
          <MessageAttachmentCard
            handleRemoveAttachment={handleRemoveAttachment}
            attachment={attachment}
            key={attachment.alias}
            deletable={deletable}
            cardWidth={cardWidth}
            addable={addable}
            patientName={patientName}
            message={message}
            hasRelatedPatient={hasRelatedPatient}
          />
        ))}
      </div>
    )
  );
};

export default MessagesAttachments;
