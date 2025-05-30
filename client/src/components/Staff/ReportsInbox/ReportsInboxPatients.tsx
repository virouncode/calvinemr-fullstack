import React, { useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
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
  const debouncedSearch = useDebounce(search, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };
  return (
    <div className="reports__patients">
      <div className="reports__patients-search">
        <Input
          value={search}
          onChange={handleSearch}
          placeholder="Search..."
          label="Related Patient"
        />
      </div>
      <PatientsList
        isPatientChecked={isPatientChecked}
        handleCheckPatient={handleCheckPatient}
        search={debouncedSearch}
      />
    </div>
  );
};

export default ReportsInboxPatients;
