import { useNavigate } from "react-router-dom";
import { toPatientName } from "../../../../utils/names/toPatientName";
import Button from "../../../UI/Buttons/Button";
import ArrowLeftIcon from "../../../UI/Icons/ArrowLeftIcon";
import ExclamationIcon from "../../../UI/Icons/ExclamationIcon";
import TrashIcon from "../../../UI/Icons/TrashIcon";

const MessageExternalDetailToolbar = ({
  message,
  section,
  posting,
  handleClickBack,
  handleAddToClinicalNotes,
  handleDeleteMsg,
}) => {
  const navigate = useNavigate();
  return (
    <div className="message-detail__toolbar">
      <ArrowLeftIcon onClick={handleClickBack} mr={20} />
      <div className="message-detail__toolbar-subject">
        {message.high_importance && <ExclamationIcon mr={5} />}
        {message.subject}
      </div>
      <div className="message-detail__toolbar-patient">
        <div className="message-detail__toolbar-patient-text">
          {message.from_patient_id ? (
            <div
              className="message-detail__toolbar-patient-link"
              onClick={() =>
                navigate(`/staff/patient-record/${message.from_patient_id}`)
              }
            >
              {toPatientName(message.from_patient_infos)}
            </div>
          ) : (
            message.to_patients_ids.map(({ to_patient_infos }, index) => (
              <div
                className="message-detail__toolbar-patient-link"
                onClick={() =>
                  navigate(
                    `/staff/patient-record/${to_patient_infos.patient_id}`
                  )
                }
                key={to_patient_infos.patient_id}
              >
                {toPatientName(to_patient_infos)}
                {index !== message.to_patients_ids.length - 1 && " /"}
              </div>
            ))
          )}
        </div>
        {section !== "Deleted messages" && (
          <div className="message-detail__toolbar-patient-btn">
            <Button
              onClick={handleAddToClinicalNotes}
              disabled={posting}
              label="Add to patient(s) clinical notes"
            />
          </div>
        )}
      </div>
      <div className="message-detail__toolbar-logos">
        {section !== "Deleted messages" && (
          <TrashIcon onClick={handleDeleteMsg} />
        )}
      </div>
    </div>
  );
};

export default MessageExternalDetailToolbar;
