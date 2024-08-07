import DoctorAbsoluteIcon from "../../../../../UI/Icons/DoctorAbsoluteIcon";
import UserPlusAbsoluteIcon from "../../../../../UI/Icons/UserPlusAbsoluteIcon";
import Input from "../../../../../UI/Inputs/Input";
import LetterDate from "./LetterDate";
import LetterPatientInfos from "./LetterPatientInfos";

const LetterSubheader = ({
  recipientInfos,
  setRecipientInfos,
  setRefOHIPSearchVisible,
  setPatientSearchVisible,
  subject,
  setSubject,
  demographicsInfos,
  date,
}) => {
  const handleChangeSubject = (e) => {
    setSubject(e.target.value);
  };

  const handleChangeRecipient = (e) => {
    setRecipientInfos(e.target.value);
  };

  return (
    <div className="letter__subheader">
      <div className="letter__recipient" style={{ position: "relative" }}>
        <label>Addressed to:</label>
        <textarea
          rows="5"
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
          autoComplete="off"
          id="letter-subject"
        />
      </div>
      <LetterPatientInfos demographicsInfos={demographicsInfos} />
      <LetterDate date={date} />
    </div>
  );
};

export default LetterSubheader;
