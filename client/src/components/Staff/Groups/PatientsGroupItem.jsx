
import { useNavigate } from "react-router-dom";
import { toPatientName } from "../../../utils/names/toPatientName";

const PatientsGroupItem = ({ patient, index }) => {
  const navigate = useNavigate();
  const handleClickPatient = () => {
    navigate(`/staff/patient-record/${patient.patient_infos.patient_id}`);
  };
  return (
    <li
      className="patients-groups__card-list-item"
      onClick={handleClickPatient}
    >
      {index + 1}. {toPatientName(patient.patient_infos)}
    </li>
  );
};

export default PatientsGroupItem;
