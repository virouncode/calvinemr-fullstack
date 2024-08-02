
import {
    genderCT,
    toCodeTableName,
} from "../../../../../../omdDatas/codesTables";
import {
    getAgeTZ,
    timestampToDateISOTZ,
} from "../../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../../utils/names/toPatientName";
import LetterRecordInfosItem from "./LetterRecordInfosItem";

const LetterRecordInfosPagePreviewAdditional = ({
  topicsSelectedAdditional,
  patientId,
  demographicsInfos,
  printRecordInfosAdditionalRef,
}) => {
  return (
    <div className="letter__second-page" ref={printRecordInfosAdditionalRef}>
      <div className="letter__patient-infos">
        <p>
          Patient: {toPatientName(demographicsInfos)}
          <br />
          {toCodeTableName(genderCT, demographicsInfos.Gender)}, Born{" "}
          {timestampToDateISOTZ(demographicsInfos.DateOfBirth)},{" "}
          {getAgeTZ(demographicsInfos.DateOfBirth)} years old,{" "}
          {demographicsInfos.HealthCard?.Number
            ? `\nHealth Card Number: ${demographicsInfos.HealthCard?.Number}`
            : ""}
        </p>
      </div>
      <div className="letter__body letter__body--second">
        Here are further patient record information :
        {topicsSelectedAdditional.map((topic) => (
          <LetterRecordInfosItem
            topic={topic}
            key={topic}
            patientId={patientId}
          />
        ))}
      </div>
    </div>
  );
};

export default LetterRecordInfosPagePreviewAdditional;
