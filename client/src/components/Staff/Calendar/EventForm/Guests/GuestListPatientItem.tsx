import React from "react";
import { NavLink } from "react-router-dom";
import { DemographicsType } from "../../../../../types/api";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import TrashIcon from "../../../../UI/Icons/TrashIcon";

type GuestListPatientItemProps = {
  patient: DemographicsType;
  handleRemovePatientGuest: (patient: DemographicsType) => void;
};

const GuestListPatientItem = ({
  patient,
  handleRemovePatientGuest,
}: GuestListPatientItemProps) => {
  return (
    <>
      <NavLink
        to={`/staff/patient-record/${patient.patient_id}`}
        className="guest-patient-item"
      >
        {toPatientName(patient)}
      </NavLink>
      <span>
        <TrashIcon onClick={() => handleRemovePatientGuest(patient)} ml={5} /> /
      </span>
    </>
  );
};

export default GuestListPatientItem;
