import MessageExternalAttachmentCard from "./MessageExternalAttachmentCard";

const MessagesExternalAttachments = ({
  attachments,
  deletable,
  cardWidth,
  addable,
  patientsIds,
  patientsNames,
  message,
}) => {
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
