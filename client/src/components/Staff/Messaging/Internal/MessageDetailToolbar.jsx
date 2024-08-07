import { useNavigate } from "react-router-dom";
import { toPatientName } from "../../../../utils/names/toPatientName";
import Button from "../../../UI/Buttons/Button";
import ArrowLeftIcon from "../../../UI/Icons/ArrowLeftIcon";
import ExclamationIcon from "../../../UI/Icons/ExclamationIcon";
import PenIcon from "../../../UI/Icons/PenIcon";
import TrashIcon from "../../../UI/Icons/TrashIcon";

const MessageDetailToolbar = ({
  message,
  section,
  posting,
  handleClickBack,
  handleAddToClinicalNotes,
  handleEdit,
  handleDeleteMsg,
}) => {
  const navigate = useNavigate();
  const handleClickPatient = () => {
    navigate(`/staff/patient-record/${message.related_patient_id}`);
  };
  return (
    <div className="message-detail__toolbar">
      <ArrowLeftIcon onClick={handleClickBack} mr={20} />
      <div className="message-detail__toolbar-subject">
        {message.high_importance && <ExclamationIcon mr={5} />}
        {message.subject}
      </div>
      <div
        className={
          section === "To-dos"
            ? "message-detail__toolbar-patient message-detail__toolbar-patient--todo"
            : "message-detail__toolbar-patient"
        }
      >
        {message.related_patient_id ? (
          <>
            <div className="message-detail__toolbar-patient-text">
              <strong>Related patient:</strong>
              <div
                className="message-detail__toolbar-patient-link"
                onClick={handleClickPatient}
              >
                {toPatientName(message.patient_infos)}
              </div>
            </div>
            {section !== "To-dos" && section !== "Deleted messages" && (
              <div className="message-detail__toolbar-patient-btn">
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
      <div
        className={
          section === "To-dos"
            ? "message-detail__toolbar-logos message-detail__toolbar-logos--todo"
            : "message-detail__toolbar-logos"
        }
      >
        {section === "To-dos" && <PenIcon mr={5} onClick={handleEdit} />}
        {section !== "Deleted messages" && (
          <TrashIcon onClick={handleDeleteMsg} />
        )}
      </div>
    </div>
  );
};

export default MessageDetailToolbar;
