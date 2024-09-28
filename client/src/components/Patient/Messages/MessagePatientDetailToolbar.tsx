import React from "react";
import { MessageExternalType } from "../../../types/api";
import ArrowLeftIcon from "../../UI/Icons/ArrowLeftIcon";
import ExclamationIcon from "../../UI/Icons/ExclamationIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";

type MessagePatientDetailToolbarProps = {
  message: MessageExternalType;
  section: string;
  handleClickBack: () => void;
  handleDeleteMsg: () => void;
};

const MessagePatientDetailToolbar = ({
  message,
  section,
  handleClickBack,
  handleDeleteMsg,
}: MessagePatientDetailToolbarProps) => {
  return (
    <div className="message__detail-toolbar message__detail-toolbar--patient">
      <ArrowLeftIcon onClick={handleClickBack} mr={20} />
      <div className="message__detail-toolbar-subject">
        {message.high_importance && <ExclamationIcon mr={5} />}
        {message.subject}
      </div>
      <div className="message__detail-toolbar-patient"></div>
      <div className="message__detail-toolbar-logos">
        {section !== "Deleted messages" && (
          <TrashIcon onClick={handleDeleteMsg} />
        )}
      </div>
    </div>
  );
};

export default MessagePatientDetailToolbar;
