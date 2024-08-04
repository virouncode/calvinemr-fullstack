import Checkbox from "../../UI/Checkbox/Checkbox";

const PatientsListItem = ({
  info,
  handleCheckPatient,
  isPatientChecked,
  patientName,
  progress,
  lastItemRef = null,
  allPatientsChecked,
}) => {
  return (
    <li className="patients__list-item" ref={lastItemRef}>
      <Checkbox
        id={info.patient_id}
        name={info.patient_id}
        onChange={(e) => handleCheckPatient(e, info)}
        checked={isPatientChecked(info.patient_id) || allPatientsChecked}
        disabled={progress}
        label={patientName}
      />
    </li>
  );
};

export default PatientsListItem;
