import { NavLink } from "react-router-dom";
import { toPatientName } from "../../../../utils/names/toPatientName";
import TrashIcon from "../../../UI/Icons/TrashIcon";

const GuestListPatientItem = ({ patient, handleRemovePatientGuest }) => {
  return (
    <>
      <NavLink
        to={`/staff/patient-record/${patient.patient_id}`}
        className="guest-patient-item"
      >
        {toPatientName(patient)}
      </NavLink>
      <span>
        <TrashIcon
          onClick={(e) => handleRemovePatientGuest(e, patient)}
          ml={5}
        />{" "}
        /
      </span>
    </>
  );
};

export default GuestListPatientItem;
