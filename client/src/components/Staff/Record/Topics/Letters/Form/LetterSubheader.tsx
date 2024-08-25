import React from "react";
import { DemographicsType } from "../../../../../../types/api";
import DoctorAbsoluteIcon from "../../../../../UI/Icons/DoctorAbsoluteIcon";
import UserPlusAbsoluteIcon from "../../../../../UI/Icons/UserPlusAbsoluteIcon";
import Input from "../../../../../UI/Inputs/Input";
import LetterDate from "./LetterDate";
import LetterPatientInfos from "./LetterPatientInfos";

type LetterSubheaderProps = {
  recipientInfos: string;
  setRecipientInfos: React.Dispatch<React.SetStateAction<string>>;
  setRefOHIPSearchVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setPatientSearchVisible: React.Dispatch<React.SetStateAction<boolean>>;
  subject: string;
  setSubject: React.Dispatch<React.SetStateAction<string>>;
  demographicsInfos: DemographicsType;
  dateStr: string;
};

const LetterSubheader = ({
  recipientInfos,
  setRecipientInfos,
  setRefOHIPSearchVisible,
  setPatientSearchVisible,
  subject,
  setSubject,
  demographicsInfos,
  dateStr,
}: LetterSubheaderProps) => {
  const handleChangeSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleChangeRecipient = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRecipientInfos(e.target.value);
  };

  return (
    <div className="letter__subheader">
      <div className="letter__recipient" style={{ position: "relative" }}>
        <label>Addressed to:</label>
        <textarea
          rows={5}
          value={recipientInfos}
          onChange={handleChangeRecipient}
          autoFocus
          autoComplete="off"
        />
        <DoctorAbsoluteIcon
          top={5}
          right={5}
          onClick={() => setRefOHIPSearchVisible(true)}
        />
        <UserPlusAbsoluteIcon
          right={20}
          top={5}
          onClick={() => setPatientSearchVisible(true)}
        />
      </div>
      <div className="letter__subject">
        <Input
          label="Subject:"
          value={subject}
          onChange={handleChangeSubject}
          id="letter-subject"
        />
      </div>
      <LetterPatientInfos demographicsInfos={demographicsInfos} />
      <LetterDate dateStr={dateStr} />
    </div>
  );
};

export default LetterSubheader;
