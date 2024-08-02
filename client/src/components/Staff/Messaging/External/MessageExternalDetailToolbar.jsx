import { useNavigate } from "react-router-dom";
import { toPatientName } from "../../../../utils/names/toPatientName";

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
              >
                {toPatientName(to_patient_infos)}
                {index !== message.to_patients_ids.length - 1 && " /"}
              </div>
            ))
          )}
        </div>
        {section !== "Deleted messages" && (
          <div className="message-detail__toolbar-patient-btn">
            <button onClick={handleAddToClinicalNotes} disabled={posting}>
              Add to patient(s) clinical notes
            </button>
          </div>
        )}
      </div>
      <div className="message-detail__toolbar-logos">
        {section !== "Deleted messages" && (
          <i
            className="fa-solid fa-trash  message-detail__trash"
            onClick={handleDeleteMsg}
          />
        )}
      </div>
    </div>
  );
};

export default MessageExternalDetailToolbar;
