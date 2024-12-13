import React from "react";
import {
  MessageAttachmentType,
  MessageExternalType,
} from "../../../../types/api";
import Button from "../../../UI/Buttons/Button";
import MessageExternal from "./MessageExternal";
import MessagesExternalAttachments from "./MessagesExternalAttachments";

type MessagesExternalPrintProps = {
  message: MessageExternalType;
  previousMsgs: MessageExternalType[];
  attachments: MessageAttachmentType[];
  printButton?: boolean;
};

const MessagesExternalPrint = ({
  message,
  previousMsgs,
  attachments,
  printButton = true,
}: MessagesExternalPrintProps) => {
  const handleClickPrint = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.nativeEvent.view?.print();
  };
  return (
    <div
      className="message__print"
      style={{
        width: printButton ? "" : "100%",
        marginTop: printButton ? "" : "1000px",
      }}
    >
      {printButton && (
        <div className="message__print-btn">
          <Button onClick={handleClickPrint} label="Print" />
        </div>
      )}
      <div className="message__print-container">
        <div className="message__print-title">
          <p
            className="message__print-subject"
            style={{
              fontSize: printButton ? "" : "1.25rem",
              padding: printButton ? "" : "0.5rem",
            }}
          >
            <strong>Subject:{"\u00A0"}</strong>
            {message.subject}
          </p>
        </div>
        <div className="message__detail-content">
          <MessageExternal
            message={message}
            key={message.id}
            index={0}
            forSnapshot={!printButton}
          />
          {previousMsgs &&
            previousMsgs.map((message, index) => (
              <MessageExternal
                message={message}
                key={message.id}
                index={index + 1}
                forSnapshot={!printButton}
              />
            ))}
          {attachments.length > 0 && printButton && (
            <MessagesExternalAttachments
              message={message}
              attachments={attachments}
              deletable={false}
              cardWidth="20%"
              addable={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesExternalPrint;
