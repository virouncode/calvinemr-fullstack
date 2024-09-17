import React, { useState } from "react";
import { DemographicsType } from "../../../types/api";
import XmarkRectangleIcon from "../../UI/Icons/XmarkRectangleIcon";
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
  closeCross?: boolean;
  patientsRef?: React.MutableRefObject<HTMLDivElement | null>;
};

const Patients = ({
  isPatientChecked,
  handleCheckPatient,
  label = true,
  msgType,
  allAvailable = false,
  allPatientsChecked = false,
  handleCheckAllPatients,
  closeCross = false,
  patientsRef,
}: PatientsProps) => {
  //Hooks
  const [search, setSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };
  const handleClose = () => {
    if (patientsRef?.current)
      patientsRef.current.style.transform = "translateX(-200%)";
  };
  return (
    <div className="patients">
      {label && (
        <div className="patients__title">
          {msgType === "Internal" ? "Related patient" : "Recipients"}
          {closeCross && (
            <XmarkRectangleIcon color=" #3d375a" onClick={handleClose} />
          )}
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
