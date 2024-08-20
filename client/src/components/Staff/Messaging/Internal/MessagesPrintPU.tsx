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
};

const MessagesPrintPU = ({
  message,
  previousMsgs,
  attachments,
  section,
}: MessagesPrintPUProps) => {
  const CONTAINER_STYLE = {
    fontFamily: "Arial, sans-serif",
  };
  const handleClickPrint = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.nativeEvent.view?.print();
  };
  return (
    <div className="messages-print__container" style={CONTAINER_STYLE}>
      <div className="messages-print__section">
        <div className="messages-print__title">
          <p className="messages-print__subject">
            <strong>Subject:{"\u00A0"}</strong>
            {message.subject}
          </p>
          {message.related_patient_id ? (
            <p className="messages-print__patient">
              <strong>Patient:{"\u00A0"}</strong>
              {toPatientName(message.patient_infos)}
            </p>
          ) : null}
        </div>
        <div className="messages-print__content">
          <Message
            message={message}
            key={message.id}
            index={0}
            section={section}
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
                />
              ) : (
                <MessageExternal
                  message={message as MessageExternalType}
                  key={message.id}
                  index={index + 1}
                />
              )
            )}
          <MessagesAttachments
            attachments={attachments}
            deletable={false}
            cardWidth="20%"
            addable={false}
          />
        </div>
        <div className="messages-print__btn">
          <Button onClick={handleClickPrint} label="Print" />
        </div>
      </div>
    </div>
  );
};

export default MessagesPrintPU;
