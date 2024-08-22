import React, { useState } from "react";
import { DemographicsType } from "../../../types/api";
import Input from "../../UI/Inputs/Input";
import PatientsList from "./PatientsList";

type PatientsProps = {
  isPatientChecked: (id: number) => boolean;
  handleCheckPatient: (
    e: React.ChangeEvent<HTMLInputElement>,
    info: DemographicsType
  ) => void;
  label?: boolean;
  msgType: string;
  allAvailable?: boolean;
  allPatientsChecked?: boolean;
  handleCheckAllPatients?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Patients = ({
  isPatientChecked,
  handleCheckPatient,
  label = true,
  msgType,
  allAvailable = false,
  allPatientsChecked = false,
  handleCheckAllPatients,
}: PatientsProps) => {
  //Hooks
  const [search, setSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <Input
          value={search}
          onChange={handleChange}
          id="patient-search"
          placeholder="Name, Email, Chart#, Health Card#,..."
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
