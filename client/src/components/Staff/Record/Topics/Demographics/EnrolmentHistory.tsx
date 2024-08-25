import React from "react";
import {
  DemographicsType,
  EnrolmentHistoryType,
} from "../../../../../types/api";
import EnrolmentItem from "./EnrolmentItem";

type EnrolmentHistoryProps = {
  enrolmentHistory: EnrolmentHistoryType[];
  demographicsInfos: DemographicsType;
};

const EnrolmentHistory = ({
  enrolmentHistory,
  demographicsInfos,
}: EnrolmentHistoryProps) => {
  return (
    <div className="enrolment-history__container">
      {enrolmentHistory.length > 0 ? (
        <ul>
          {enrolmentHistory.map((enrolment, index) => (
            <EnrolmentItem
              enrolment={enrolment}
              enrolmentIndex={index}
              demographicsInfos={demographicsInfos}
              enrolmentHistory={enrolmentHistory}
              key={index + (enrolment.EnrollmentDate ?? 0)}
            />
          ))}
        </ul>
      ) : (
        "No enrolments"
      )}
    </div>
  );
};

export default EnrolmentHistory;
