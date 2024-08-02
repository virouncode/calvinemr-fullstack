
import { NavLink } from "react-router-dom";
import { toPatientName } from "../../../../utils/names/toPatientName";

const GuestListPatientItem = ({
  patient,
  handleRemoveGuest,
  handleRemovePatientGuest,
}) => {
  return (
    <>
      <NavLink
        to={`/staff/patient-record/${patient.patient_id}`}
        className="guest-patient-item"
      >
        {toPatientName(patient)}
      </NavLink>
      <span>
        <i
          className="fa-solid fa-trash"
          onClick={(e) => handleRemovePatientGuest(e, patient)}
          style={{ cursor: "pointer", marginLeft: "5px" }}
        />{" "}
        /
      </span>{" "}
    </>
  );
};

export default GuestListPatientItem;
