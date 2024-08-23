import React from "react";
import { TopicType } from "../../../../../../types/api";
import AllergiesLetter from "./AllergiesLetter";
import FamilyHistoryLetter from "./FamilyHistoryLetter";
import MedicationsLetter from "./MedicationsLetter";
import PastHealthLetter from "./PastHealthLetter";
import PregnanciesLetter from "./PregnanciesLetter";

type LetterRecordInfosItemProps = {
  topic: TopicType;
  patientId: number;
};

const LetterRecordInfosItem = ({
  topic,
  patientId,
}: LetterRecordInfosItemProps) => {
  switch (topic) {
    case "PAST HEALTH":
      return <PastHealthLetter patientId={patientId} />;
    case "FAMILY HISTORY":
      return <FamilyHistoryLetter patientId={patientId} />;
    case "MEDICATIONS & TREATMENTS":
      return <MedicationsLetter patientId={patientId} />;
    case "ALLERGIES & ADVERSE REACTIONS":
      return <AllergiesLetter patientId={patientId} />;
    case "PREGNANCIES":
      return <PregnanciesLetter patientId={patientId} />;
  }
};
export default LetterRecordInfosItem;
