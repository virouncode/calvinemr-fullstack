import MessageAttachmentCard from "./MessageAttachmentCard";

const MessagesAttachments = ({
  attachments,
  deletable,
  addable,
  cardWidth,
  handleRemoveAttachment = null,
  patientId = null,
  patientName = "",
  message = null,
  hasRelatedPatient = false,
}) => {
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
            patientId={patientId}
            message={message}
            hasRelatedPatient={hasRelatedPatient}
          />
        ))}
      </div>
    )
  );
};

export default MessagesAttachments;
