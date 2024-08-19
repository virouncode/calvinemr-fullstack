import React from "react";
import { DemographicsType } from "../../../types/api";
import Checkbox from "../../UI/Checkbox/Checkbox";

type PatientsListItemProps = {
  info: DemographicsType;
  handleCheckPatient: (
    e: React.ChangeEvent<HTMLInputElement>,
    info: DemographicsType
  ) => void;
  isPatientChecked: (id: number) => boolean;
  patientName: string;
  progress: boolean;
  lastItemRef?: (node: Element | null) => void;
};

const PatientsListItem = ({
  info,
  handleCheckPatient,
  isPatientChecked,
  patientName,
  progress,
  lastItemRef,
}: PatientsListItemProps) => {
  return (
    <li className="patients__list-item" ref={lastItemRef}>
      <Checkbox
        id={info.patient_id.toString()}
        name={patientName}
        onChange={(e) => handleCheckPatient(e, info)}
        checked={isPatientChecked(info.patient_id)}
        disabled={progress}
        label={patientName}
      />
    </li>
  );
};

export default PatientsListItem;
