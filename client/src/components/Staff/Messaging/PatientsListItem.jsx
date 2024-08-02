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
      <input
        id={info.patient_id}
        type="checkbox"
        onChange={(e) => handleCheckPatient(e, info)}
        checked={isPatientChecked(info.patient_id) || allPatientsChecked}
        name={patientName}
        disabled={progress}
      />
      <label htmlFor={info.patient_id}>{patientName}</label>
    </li>
  );
};

export default PatientsListItem;
