

const PatientsGroupsToggle = ({ isTypeChecked, handleTypeChanged }) => {
  return (
    <div className="patients-groups-toggle">
      <div className="patients-groups-toggle__radio">
        <input
          type="radio"
          value="My groups"
          name="My groups"
          checked={isTypeChecked("My groups")}
          onChange={handleTypeChanged}
          id="my-groups"
        />
        <label htmlFor="my-groups">My groups</label>
      </div>
      <div className="patients-groups-toggle__radio">
        <input
          type="radio"
          value="Clinic groups"
          name="Clinic groups"
          checked={isTypeChecked("Clinic groups")}
          onChange={handleTypeChanged}
          id="clinic-groups"
        />
        <label htmlFor="clinic-groups">Clinic groups</label>
      </div>
    </div>
  );
};

export default PatientsGroupsToggle;
