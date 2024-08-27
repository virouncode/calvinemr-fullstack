import React from "react";
import { DemographicsType } from "../../../../../types/api";
import {
  getAgeTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import {
  toPatientFirstName,
  toPatientLastName,
} from "../../../../../utils/names/toPatientName";

type CyclePrintPatientProps = {
  patientInfos: DemographicsType;
};

const CyclePrintPatient = ({ patientInfos }: CyclePrintPatientProps) => {
  return (
    <div className="cycle-print__patient">
      <div className="cycle-print__patient-title">Patient</div>
      <div className="cycle-print__patient-content">
        <div className="cycle-print__patient-item">
          <label>Chart#:</label>
          <span>{patientInfos.ChartNumber}</span>
        </div>
        <div className="cycle-print__patient-item">
          <label>Last name:</label>
          <span>{toPatientLastName(patientInfos)}</span>
        </div>
        <div className="cycle-print__patient-item">
          <label>First name:</label>
          <span>{toPatientFirstName(patientInfos)}</span>
        </div>
        <div className="cycle-print__patient-item">
          <label>Date of birth:</label>
          <span>{timestampToDateISOTZ(patientInfos.DateOfBirth)}</span>
        </div>
        <div className="cycle-print__patient-item">
          <label>Current age:</label>
          <span>{getAgeTZ(patientInfos.DateOfBirth)}</span>
        </div>
      </div>
    </div>
  );
};

export default CyclePrintPatient;
