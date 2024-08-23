import React from "react";
import { TopicType } from "../../../../../../types/api";
import Checkbox from "../../../../../UI/Checkbox/Checkbox";

type LetterAddPatientRecordsProps = {
  isTopicSelected: (topic: TopicType) => boolean;
  handleCheckTopic: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const LetterAddPatientRecords = ({
  isTopicSelected,
  handleCheckTopic,
}: LetterAddPatientRecordsProps) => {
  return (
    <div className="letter__options-records">
      <p className="letter__options-records-title">
        Add additional patient infos
      </p>
      <ul className="letter__options-records-list">
        <li className="letter__options-item">
          <Checkbox
            id="past-health"
            name="PAST HEALTH"
            onChange={handleCheckTopic}
            checked={isTopicSelected("PAST HEALTH")}
            label="Past health"
          />
        </li>
        <li className="letter__options-item">
          <Checkbox
            id="am-history"
            name="FAMILY HISTORY"
            onChange={handleCheckTopic}
            checked={isTopicSelected("FAMILY HISTORY")}
            label="Family history"
          />
        </li>
        <li className="letter__options-item">
          <Checkbox
            id="medications"
            name="MEDICATIONS & TREATMENTS"
            onChange={handleCheckTopic}
            checked={isTopicSelected("MEDICATIONS & TREATMENTS")}
            label="Active Meds"
          />
        </li>
        <li className="letter__options-item">
          <Checkbox
            id="allergies"
            name="ALLERGIES & ADVERSE REACTIONS"
            onChange={handleCheckTopic}
            checked={isTopicSelected("ALLERGIES & ADVERSE REACTIONS")}
            label="Allergies"
          />
        </li>
        <li className="letter__options-item">
          <Checkbox
            id="pregnancies"
            name="PREGNANCIES"
            onChange={handleCheckTopic}
            checked={isTopicSelected("PREGNANCIES")}
            label="Pregnancies"
          />
        </li>
      </ul>
    </div>
  );
};

export default LetterAddPatientRecords;
