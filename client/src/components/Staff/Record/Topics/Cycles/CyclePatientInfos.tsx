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

type CyclePatientInfosProps = {
  demographicsInfos: DemographicsType;
  errMsg: string;
};

const CyclePatientInfos = ({
  demographicsInfos,
  errMsg,
}: CyclePatientInfosProps) => {
  return (
    <fieldset
      className="cycles-form__patient-infos"
      style={{ border: errMsg && "solid 1px red" }}
    >
      <legend>PATIENT</legend>
      <div className="cycles-form__patient-infos-content">
        <div className="cycles-form__patient-infos-content-row">
          <div className="cycles-form__patient-infos-item">
            <label>Chart#</label>
            <span>{demographicsInfos.ChartNumber}</span>
          </div>
          <div className="cycles-form__patient-infos-item">
            <label>Last name</label>
            <span>{toPatientLastName(demographicsInfos)}</span>
          </div>
          <div className="cycles-form__patient-infos-item">
            <label>First name</label>
            <span>{toPatientFirstName(demographicsInfos)}</span>
          </div>
          <div className="cycles-form__patient-infos-item">
            <label>Date of birth</label>
            <span>{timestampToDateISOTZ(demographicsInfos.DateOfBirth)}</span>
          </div>
          <div className="cycles-form__patient-infos-item">
            <label>Current age</label>
            <span>{getAgeTZ(demographicsInfos.DateOfBirth)}</span>
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default CyclePatientInfos;
