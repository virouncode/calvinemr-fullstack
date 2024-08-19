import React, { useState } from "react";
import { DemographicsType } from "../../../types/api";
import Input from "../../UI/Inputs/Input";
import PatientsList from "../Messaging/PatientsList";

type ReportsInboxPatientsProps = {
  isPatientChecked: (id: number) => boolean;
  handleCheckPatient: (
    e: React.ChangeEvent<HTMLInputElement>,
    patient: DemographicsType
  ) => void;
};

const ReportsInboxPatients = ({
  isPatientChecked,
  handleCheckPatient,
}: ReportsInboxPatientsProps) => {
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
