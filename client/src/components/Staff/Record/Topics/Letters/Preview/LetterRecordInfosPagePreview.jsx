
import useUserContext from "../../../../../../hooks/context/useUserContext";
import {
    genderCT,
    toCodeTableName,
} from "../../../../../../omdDatas/codesTables";
import {
    getAgeTZ,
    timestampToDateISOTZ,
} from "../../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../../utils/names/toPatientName";

const LetterRecordInfosPagePreview = ({
  printRecordInfosRef,
  recordInfosBody,
  demographicsInfos,
  numberOfPages,
  pagesLength,
}) => {
  const { user } = useUserContext();
  return (
    <div className="letter__page" ref={printRecordInfosRef}>
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
          }}
        >
          {recordInfosBody}
        </div>
      </div>
      <div className="letter__sign">
        {user.sign?.url && (
          <div className="letter__sign-image">
            <img
              src={user.sign?.url}
              alt="doctor-sign"
              crossOrigin="Anonymous"
            />
          </div>
        )}
      </div>
      <div style={{ fontSize: "0.7rem", padding: "0 10px" }}>
        Page: {pagesLength + 1}/{numberOfPages}
      </div>
    </div>
  );
};

export default LetterRecordInfosPagePreview;
