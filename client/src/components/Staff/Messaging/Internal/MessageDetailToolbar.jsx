import { useNavigate } from "react-router-dom";
import { toPatientName } from "../../../../utils/names/toPatientName";
import Button from "../../../UI/Buttons/Button";

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
      <i
        className="fa-solid fa-arrow-left message-detail__toolbar-arrow"
        style={{ cursor: "pointer" }}
        onClick={handleClickBack}
      />
      <div className="message-detail__toolbar-subject">
        {message.high_importance && (
          <i
            className="fa-solid fa-circle-exclamation"
            style={{ color: "red", marginRight: "5px" }}
          />
        )}
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
        {section === "To-dos" && (
          <i
            className="fa-solid fa-pen-to-square"
            style={{ marginRight: "5px" }}
            onClick={handleEdit}
          />
        )}
        {section !== "Deleted messages" && (
          <i className="fa-solid fa-trash" onClick={handleDeleteMsg} />
        )}
      </div>
    </div>
  );
};

export default MessageDetailToolbar;
