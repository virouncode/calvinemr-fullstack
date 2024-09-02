import React from "react";
import { TopicType } from "../../../../../../types/api";
import LetterAllergies from "./Topics/LetterAllergies";
import LetterFamilyHistory from "./Topics/LetterFamilyHistory";
import LetterMedications from "./Topics/LetterMedications";
import LetterPastHealth from "./Topics/LetterPastHealth";
import LetterPregnancies from "./Topics/LetterPregnancies";

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
      return <LetterPastHealth patientId={patientId} />;
    case "FAMILY HISTORY":
      return <LetterFamilyHistory patientId={patientId} />;
    case "MEDICATIONS & TREATMENTS":
      return <LetterMedications patientId={patientId} />;
    case "ALLERGIES & ADVERSE REACTIONS":
      return <LetterAllergies patientId={patientId} />;
    case "PREGNANCIES":
      return <LetterPregnancies patientId={patientId} />;
  }
};
export default LetterRecordInfosItem;
