import React from "react";
import {
  MessageAttachmentType,
  MessageType,
  TodoType,
} from "../../../../types/api";
import MessageAttachmentCard from "./MessageAttachmentCard";

//used in Messages and PatientMessages
type MessageAttachmentsProps = {
  attachments: Partial<MessageAttachmentType>[];
  deletable?: boolean;
  addable?: boolean;
  cardWidth?: string;
  handleRemoveAttachment?: (attachmentName: string) => void;
  patientName?: string;
  message?: MessageType | TodoType;
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
      <div className="message__attachments">
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
