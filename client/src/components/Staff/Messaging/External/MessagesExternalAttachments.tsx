import React from "react";
import {
  MessageAttachmentType,
  MessageExternalType,
} from "../../../../types/api";
import MessageExternalAttachmentCard from "./MessageExternalAttachmentCard";
type MessagesExternalAttachmentsProps = {
  attachments: MessageAttachmentType[];
  deletable?: boolean;
  cardWidth?: string;
  addable?: boolean;
  patientsIds: number[];
  patientsNames: string[];
  message: MessageExternalType;
};
const MessagesExternalAttachments = ({
  attachments,
  deletable,
  cardWidth,
  addable,
  patientsIds,
  patientsNames,
  message,
}: MessagesExternalAttachmentsProps) => {
  return (
    attachments && (
      <div className="message-attachments">
        {attachments.map((attachment) => (
          <MessageExternalAttachmentCard
            attachment={attachment}
            key={attachment.alias}
            deletable={deletable}
            cardWidth={cardWidth}
            addable={addable}
            patientsNames={patientsNames}
            patientsIds={patientsIds}
            message={message}
          />
        ))}
      </div>
    )
  );
};

export default MessagesExternalAttachments;
