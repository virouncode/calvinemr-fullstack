import React from "react";
import { useNavigate } from "react-router-dom";
import { DemographicsType } from "../../../types/api";
import { toPatientName } from "../../../utils/names/toPatientName";

type PatientsGroupItemProps = {
  patient: { patient_infos: DemographicsType } | undefined;
  index: number;
};

const PatientsGroupItem = ({ patient, index }: PatientsGroupItemProps) => {
  //Hooks
  const navigate = useNavigate();

  const handleClickPatient = () => {
    navigate(`/staff/patient-record/${patient?.patient_infos.patient_id}`);
  };
  return (
    patient && (
      <li className="groups__card-list-item" onClick={handleClickPatient}>
        {index + 1}. {toPatientName(patient.patient_infos)}
      </li>
    )
  );
};

export default PatientsGroupItem;
