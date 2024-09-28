import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageType, TodoType } from "../../../../types/api";
import { toPatientName } from "../../../../utils/names/toPatientName";
import Button from "../../../UI/Buttons/Button";
import ArrowLeftIcon from "../../../UI/Icons/ArrowLeftIcon";
import ExclamationIcon from "../../../UI/Icons/ExclamationIcon";
import PenIcon from "../../../UI/Icons/PenIcon";
import TrashIcon from "../../../UI/Icons/TrashIcon";

type MessageDetailToolbarProps = {
  message: MessageType | TodoType;
  section: string;
  posting: boolean;
  handleClickBack: () => void;
  handleAddToClinicalNotes: () => void;
  handleEdit: () => void;
  handleDeleteMsg: () => void;
};

const MessageDetailToolbar = ({
  message,
  section,
  posting,
  handleClickBack,
  handleAddToClinicalNotes,
  handleEdit,
  handleDeleteMsg,
}: MessageDetailToolbarProps) => {
  //Hooks
  const navigate = useNavigate();

  const handleClickPatient = () => {
    navigate(`/staff/patient-record/${message.related_patient_id}`);
  };
  return (
    <div
      className={
        section === "To-dos"
          ? "message__detail-toolbar message__detail-toolbar--todo"
          : "message__detail-toolbar"
      }
    >
      <ArrowLeftIcon onClick={handleClickBack} mr={20} />
      <div className="message__detail-toolbar-subject">
        {message.high_importance && <ExclamationIcon mr={5} />}
        {message.subject}
      </div>
      <div className="message__detail-toolbar-patient">
        {message.related_patient_id ? (
          <>
            <div
              className="message__detail-toolbar-patient-link"
              onClick={handleClickPatient}
            >
              <strong>Related patient: </strong>
              {toPatientName(message.patient_infos)}
            </div>
            {section !== "To-dos" && section !== "Deleted messages" && (
              <div className="message__detail-toolbar-patient-btn">
                <Button
                  onClick={handleAddToClinicalNotes}
                  disabled={posting}
                  label="Add to patient clinical notes"
                />
              </div>
            )}
          </>
        ) : null}
      </div>
      <div className="message__detail-toolbar-logos">
        {section === "To-dos" && <PenIcon mr={5} onClick={handleEdit} />}
        {section !== "Deleted messages" && (
          <TrashIcon onClick={handleDeleteMsg} />
        )}
      </div>
    </div>
  );
};

export default MessageDetailToolbar;
