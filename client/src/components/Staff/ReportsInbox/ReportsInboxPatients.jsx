import { useState } from "react";
import Input from "../../UI/Inputs/Input";
import PatientsList from "../Messaging/PatientsList";

const ReportsInboxPatients = ({ isPatientChecked, handleCheckPatient }) => {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
  };
  return (
    <div className="reportsinbox__patients">
      <Input value={search} onChange={handleSearch} placeholder="Search..." />
      <div className="reportsinbox__patients-list">
        <PatientsList
          isPatientChecked={isPatientChecked}
          handleCheckPatient={handleCheckPatient}
          search={search}
        />
      </div>
    </div>
  );
};

export default ReportsInboxPatients;
