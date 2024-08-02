

const LetterAddPatientRecords = ({ isTopicSelected, handleCheckTopic }) => {
  return (
    <div className="letter__options-records">
      <p className="letter__options-records-title">
        Add additional patient infos
      </p>
      <ul className="letter__options-records-list">
        <li className="letter__options-item">
          <input
            type="checkbox"
            checked={isTopicSelected("PAST HEALTH")}
            onChange={handleCheckTopic}
            name="PAST HEALTH"
            id="past-health"
          />
          <label htmlFor="past-health">Past health</label>
        </li>
        <li className="letter__options-item">
          <input
            type="checkbox"
            checked={isTopicSelected("FAMILY HISTORY")}
            onChange={handleCheckTopic}
            name="FAMILY HISTORY"
            id="fam-history"
          />
          <label htmlFor="fam-history">Family history</label>
        </li>
        <li className="letter__options-item">
          <input
            type="checkbox"
            checked={isTopicSelected("MEDICATIONS & TREATMENTS")}
            onChange={handleCheckTopic}
            name="MEDICATIONS & TREATMENTS"
            id="medications"
          />
          <label htmlFor="medications">Active Meds</label>
        </li>
        <li className="letter__options-item">
          <input
            type="checkbox"
            checked={isTopicSelected("ALLERGIES & ADVERSE REACTIONS")}
            onChange={handleCheckTopic}
            name="ALLERGIES & ADVERSE REACTIONS"
            id="allergies"
          />
          <label htmlFor="allergies">Allergies</label>
        </li>
        <li className="letter__options-item">
          <input
            type="checkbox"
            checked={isTopicSelected("PREGNANCIES")}
            onChange={handleCheckTopic}
            name="PREGNANCIES"
            id="pregnancies"
          />
          <label htmlFor="pregnancies">Pregnancies</label>
        </li>
      </ul>
    </div>
  );
};

export default LetterAddPatientRecords;
