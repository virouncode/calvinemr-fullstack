

const PatientsGroupTypeRadio = ({ groupInfos, handleChangeType }) => {
  return (
    <div className="patients-groups__edit-row-radio">
      <div className="patients-groups__edit-row-radio-item">
        <input
          type="radio"
          id="personal"
          name="global"
          value={false}
          checked={!groupInfos.global}
          onChange={handleChangeType}
        />
        <label htmlFor="personal">Personal Group</label>
      </div>
      <div className="patients-groups__edit-row-radio-item">
        <input
          type="radio"
          id="global"
          name="global"
          value={true}
          checked={groupInfos.global}
          onChange={handleChangeType}
        />
        <label htmlFor="global">Clinic Group</label>
      </div>
    </div>
  );
};

export default PatientsGroupTypeRadio;
