import { Tooltip } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { DemographicsType, MessageExternalType } from "../../../../types/api";
import { toPatientName } from "../../../../utils/names/toPatientName";
import Button from "../../../UI/Buttons/Button";
import ArrowLeftIcon from "../../../UI/Icons/ArrowLeftIcon";
import ExclamationIcon from "../../../UI/Icons/ExclamationIcon";
import TrashIcon from "../../../UI/Icons/TrashIcon";

type MessageExternalDetailToolbarProps = {
  message: MessageExternalType;
  section: string;
  posting: boolean;
  handleClickBack: () => void;
  handleAddToClinicalNotes: () => void;
  handleDeleteMsg: () => void;
};

const MessageExternalDetailToolbar = ({
  message,
  section,
  posting,
  handleClickBack,
  handleAddToClinicalNotes,
  handleDeleteMsg,
}: MessageExternalDetailToolbarProps) => {
  //Hooks
  const navigate = useNavigate();
  return (
    <div className="message__detail-toolbar">
      <ArrowLeftIcon onClick={handleClickBack} mr={20} />
      <div className="message__detail-toolbar-subject">
        {message.high_importance && <ExclamationIcon mr={5} />}
        {message.subject}
      </div>
      <div className="message__detail-toolbar-patient">
        {message.from_patient_id ? (
          <div
            className="message__detail-toolbar-patient-link"
            onClick={() =>
              navigate(`/staff/patient-record/${message.from_patient_id}`)
            }
          >
            {toPatientName(message.from_patient_infos)}
          </div>
        ) : (
          (
            message.to_patients_ids as {
              to_patient_infos: DemographicsType;
            }[]
          ).map(({ to_patient_infos }, index) => (
            <Tooltip
              title={toPatientName(to_patient_infos)}
              key={to_patient_infos.patient_id}
            >
              <div
                className="message__detail-toolbar-patient-link"
                onClick={() =>
                  navigate(
                    `/staff/patient-record/${to_patient_infos.patient_id}`
                  )
                }
              >
                {toPatientName(to_patient_infos)}
                {index !== message.to_patients_ids.length - 1 && " /"}
              </div>
            </Tooltip>
          ))
        )}
        {section !== "Deleted messages" && (
          <div className="message__detail-toolbar-patient-btn">
            <Button
              onClick={handleAddToClinicalNotes}
              disabled={posting}
              label="Add to patient(s) clinical notes"
            />
          </div>
        )}
      </div>
      <div className="message__detail-toolbar-logos">
        {section !== "Deleted messages" && (
          <TrashIcon onClick={handleDeleteMsg} />
        )}
      </div>
    </div>
  );
};

export default MessageExternalDetailToolbar;
