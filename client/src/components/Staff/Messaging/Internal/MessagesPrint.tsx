import React from "react";
import {
  MessageAttachmentType,
  MessageExternalType,
  MessageType,
  TodoType,
} from "../../../../types/api";
import { toPatientName } from "../../../../utils/names/toPatientName";
import Button from "../../../UI/Buttons/Button";
import MessageExternal from "../External/MessageExternal";
import Message from "./Message";
import MessagesAttachments from "./MessagesAttachments";

type MessagesPrintPUProps = {
  message: MessageType | TodoType;
  previousMsgs?: (MessageType | MessageExternalType)[];
  attachments: MessageAttachmentType[];
  section: string;
  printButton?: boolean;
};

const MessagesPrint = ({
  message,
  previousMsgs,
  attachments,
  section,
  printButton = true,
}: MessagesPrintPUProps) => {
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
          {message.related_patient_id ? (
            <p
              className="message__print-patient"
              style={{
                fontSize: printButton ? "" : "1.25rem",
                padding: printButton ? "" : "0.5rem",
              }}
            >
              <strong>Related Patient:{"\u00A0"}</strong>
              {toPatientName(message.patient_infos)}
            </p>
          ) : null}
        </div>
        <div className="message__detail-content">
          <Message
            message={message}
            key={message.id}
            index={0}
            section={section}
            forSnapshot={!printButton}
          />
          {section !== "To-dos" &&
            previousMsgs &&
            previousMsgs.map((message, index) =>
              message.type === "Internal" ? (
                <Message
                  message={message as MessageType}
                  key={message.id}
                  index={index + 1}
                  section={section}
                  forSnapshot={!printButton}
                />
              ) : (
                <MessageExternal
                  message={message as MessageExternalType}
                  key={message.id}
                  index={index + 1}
                  forSnapshot={!printButton}
                />
              )
            )}
          {attachments.length > 0 && printButton && (
            <MessagesAttachments
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

export default MessagesPrint;
