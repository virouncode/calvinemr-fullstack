import Radio from "../../UI/Radio/Radio";

const PatientsGroupsToggle = ({ isTypeChecked, handleTypeChanged }) => {
  return (
    <div className="patients-groups-toggle">
      <div className="patients-groups-toggle__radio">
        <Radio
          id="my-groups"
          name="My groups"
          value="My groups"
          checked={isTypeChecked("My groups")}
          onChange={handleTypeChanged}
          label="My groups"
        />
      </div>
      <div className="patients-groups-toggle__radio">
        <Radio
          id="clinic-groups"
          name="Clinic groups"
          value="Clinic groups"
          checked={isTypeChecked("Clinic groups")}
          onChange={handleTypeChanged}
          label="Clinic groups"
        />
      </div>
    </div>
  );
};

export default PatientsGroupsToggle;
