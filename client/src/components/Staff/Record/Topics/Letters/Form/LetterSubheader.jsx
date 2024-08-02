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
        <i
          style={{
            cursor: "pointer",
            position: "absolute",
            right: "5px",
            top: "5px",
          }}
          className="fa-solid fa-user-doctor no-print"
          onClick={() => setRefOHIPSearchVisible(true)}
        />
        <i
          style={{
            cursor: "pointer",
            position: "absolute",
            right: "20px",
            top: "5px",
          }}
          className="fa-solid fa-user-plus no-print"
          onClick={() => setPatientSearchVisible(true)}
        />
      </div>
      <div className="letter__subject">
        <label htmlFor="letter-subject">Subject:</label>
        <input
          type="text"
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
