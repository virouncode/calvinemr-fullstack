import {
  genderCT,
  toCodeTableName,
} from "../../../../../../omdDatas/codesTables";
import {
  getAgeTZ,
  timestampToDateISOTZ,
} from "../../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../../utils/names/toPatientName";
import LetterSign from "../Form/LetterSign";

const LetterAdditionalPagePreview = ({
  printAdditionalRefs,
  demographicsInfos,
  additionalBody,
  page,
  numberOfPages,
}) => {
  return (
    <div
      className="letter__page"
      ref={(el) => (printAdditionalRefs.current[page] = el)}
    >
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
      <div className="letter__body letter__body--additional letter__body--additional--preview">
        <div
          style={{
            width: "100%",
            height: "840px",
            fontSize: "0.85rem",
            whiteSpace: "pre-wrap",
            textAlign: "justify",
            padding: "5px 10px",
          }}
        >
          {additionalBody}
        </div>
      </div>
      <LetterSign />
      <div style={{ fontSize: "0.7rem", padding: "0 10px" }}>
        Page: {page + 2}/{numberOfPages}
      </div>
    </div>
  );
};

export default LetterAdditionalPagePreview;
