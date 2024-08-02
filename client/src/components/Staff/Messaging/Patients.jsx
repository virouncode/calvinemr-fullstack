import { useState } from "react";
import PatientsList from "./PatientsList";

const Patients = ({
  isPatientChecked,
  handleCheckPatient,
  label = true,
  msgType,
  allAvailable = false,
  allPatientsChecked = false,
  handleCheckAllPatients = null,
}) => {
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };
  return (
    <div className="patients">
      {label && (
        <div className="patients__title">
          {msgType === "Internal" ? "Related patient" : "Recipients"}
        </div>
      )}
      <div className="patients__search-input">
        <input
          type="text"
          value={search}
          placeholder="Name, Email, Chart#, Health Card#,..."
          onChange={handleChange}
        />
      </div>
      <PatientsList
        isPatientChecked={isPatientChecked}
        handleCheckPatient={handleCheckPatient}
        search={search}
        allAvailable={allAvailable}
        allPatientsChecked={allPatientsChecked}
        handleCheckAllPatients={handleCheckAllPatients}
      />
    </div>
  );
};

export default Patients;
