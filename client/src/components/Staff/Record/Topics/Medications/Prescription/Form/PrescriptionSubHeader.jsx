import { DateTime } from "luxon";
import {
  genderCT,
  toCodeTableName,
} from "../../../../../../../omdDatas/codesTables";
import {
  getAgeTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../../../utils/names/toPatientName";

const PrescriptionSubHeader = ({ demographicsInfos }) => {
  return (
    <div className="prescription__subheader">
      <div className="prescription__patient-infos">
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
          ,<br />
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
      <p className="prescription__date">
        Date emitted:{" "}
        {DateTime.fromMillis(nowTZTimestamp(), {
          zone: "America/Toronto",
          locale: "en-CA",
        }).toLocaleString({
          month: "long",
          day: "2-digit",
          year: "numeric",
        })}
      </p>
    </div>
  );
};

export default PrescriptionSubHeader;
