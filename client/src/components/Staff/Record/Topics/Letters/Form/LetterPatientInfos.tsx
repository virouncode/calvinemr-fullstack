import React from "react";
import {
  genderCT,
  toCodeTableName,
} from "../../../../../../omdDatas/codesTables";
import { DemographicsType } from "../../../../../../types/api";
import {
  getAgeTZ,
  timestampToDateISOTZ,
} from "../../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../../utils/names/toPatientName";

type LetterPatientInfosProps = {
  demographicsInfos: DemographicsType;
};

const LetterPatientInfos = ({ demographicsInfos }: LetterPatientInfosProps) => {
  return (
    <div className="letter__patient-infos">
      <p>
        Patient: {toPatientName(demographicsInfos)},{" "}
        {toCodeTableName(genderCT, demographicsInfos.Gender)}, Born{" "}
        {timestampToDateISOTZ(demographicsInfos.DateOfBirth)},{" "}
        {getAgeTZ(demographicsInfos.DateOfBirth)} years old,{" "}
        {demographicsInfos.HealthCard?.Number
          ? `\nHealth Card Number: ${demographicsInfos.HealthCard?.Number}${
              demographicsInfos.HealthCard?.Version
                ? " - " + demographicsInfos.HealthCard?.Version
                : ""
            }`
          : ""}
        , <br />
        {`Phone: ${
          demographicsInfos.PhoneNumber.find(
            ({ _phoneNumberType }) => _phoneNumberType === "C"
          )?.phoneNumber ||
          demographicsInfos.PhoneNumber.find(
            ({ _phoneNumberType }) => _phoneNumberType === "R"
          )?.phoneNumber ||
          demographicsInfos.PhoneNumber.find(
            ({ _phoneNumberType }) => _phoneNumberType === "W"
          )?.phoneNumber
        }`}
      </p>
    </div>
  );
};

export default LetterPatientInfos;
