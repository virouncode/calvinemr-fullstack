import React from "react";
import {
  genderCT,
  toCodeTableName,
} from "../../../../../../omdDatas/codesTables";
import { DemographicsType, TopicType } from "../../../../../../types/api";
import {
  getAgeTZ,
  timestampToDateISOTZ,
} from "../../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../../utils/names/toPatientName";
import LetterRecordInfosItem from "./LetterRecordInfosItem";

type LetterRecordInfosPageProps = {
  topicsSelected: TopicType[];
  patientId: number;
  demographicsInfos: DemographicsType;
  recordInfosBodyRef: React.MutableRefObject<HTMLDivElement | null>;
};

const LetterRecordInfosPage = ({
  topicsSelected,
  patientId,
  demographicsInfos,
  recordInfosBodyRef,
}: LetterRecordInfosPageProps) => {
  return (
    <div className="letter__page">
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
      <div
        className="letter__body letter__body--additional"
        ref={recordInfosBodyRef}
        style={{
          width: "100%",
          height: "840px",
          fontSize: "$size-sm",
          whiteSpace: "pre-wrap",
          textAlign: "justify",
          overflowY: "scroll",
          padding: "5px 10px",
        }}
      >
        Here are further patient record information :
        {topicsSelected.map((topic) => (
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

export default LetterRecordInfosPage;
