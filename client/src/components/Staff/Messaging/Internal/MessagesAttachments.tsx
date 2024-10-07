import React from "react";
import {
  EdocType,
  MessageAttachmentType,
  MessageType,
  PamphletType,
  TodoType,
} from "../../../../types/api";
import MessageAttachmentCard from "./MessageAttachmentCard";
import MessageAttachmentEdocCard from "./MessageAttachmentEdocCard";
import MessageAttachmentPamphletCard from "./MessageAttachmentPamphletCard";

//used in Messages and PatientMessages
type MessageAttachmentsProps = {
  attachments: Partial<MessageAttachmentType>[];
  edocs?: EdocType[];
  pamphlets?: PamphletType[];
  deletable?: boolean;
  addable?: boolean;
  cardWidth?: string;
  handleRemoveAttachment?: (attachmentName: string) => void;
  handleRemoveEdoc?: (edocId: number) => void;
  handleRemovePamphlet?: (pamphletId: number) => void;
  patientName?: string;
  message?: MessageType | TodoType;
  hasRelatedPatient?: boolean;
};

const MessagesAttachments = ({
  attachments,
  edocs,
  pamphlets,
  deletable,
  addable,
  cardWidth,
  handleRemoveAttachment,
  handleRemoveEdoc,
  handleRemovePamphlet,
  patientName,
  message,
  hasRelatedPatient = false,
}: MessageAttachmentsProps) => {
  return (
    attachments && (
      <div className="message__attachments">
        {attachments.length > 0 &&
          attachments.map((attachment) => (
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
        {(edocs?.length ?? 0) > 0 &&
          edocs?.map((edoc) => (
            <MessageAttachmentEdocCard
              handleRemoveEdoc={handleRemoveEdoc as (edocId: number) => void}
              edoc={edoc}
              key={edoc.id}
              cardWidth={cardWidth}
            />
          ))}
        {(pamphlets?.length ?? 0) > 0 &&
          pamphlets?.map((pamphlet) => (
            <MessageAttachmentPamphletCard
              handleRemovePamphlet={
                handleRemovePamphlet as (pamphletId: number) => void
              }
              pamphlet={pamphlet}
              key={pamphlet.id}
              cardWidth={cardWidth}
            />
          ))}
      </div>
    )
  );
};

export default MessagesAttachments;
