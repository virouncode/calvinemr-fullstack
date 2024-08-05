import Radio from "../../UI/Radio/Radio";

const PatientsGroupTypeRadio = ({ groupInfos, handleChangeType }) => {
  return (
    <div className="patients-groups__edit-row-radio">
      <div className="patients-groups__edit-row-radio-item">
        <Radio
          id="personal"
          name="personal"
          value={false}
          checked={!groupInfos.global}
          onChange={handleChangeType}
          label="Personal Group"
        />
      </div>
      <div className="patients-groups__edit-row-radio-item">
        <Radio
          id="global"
          name="global"
          value={true}
          checked={groupInfos.global}
          onChange={handleChangeType}
          label="Clinic Group"
        />
      </div>
    </div>
  );
};

export default PatientsGroupTypeRadio;
