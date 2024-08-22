import React from "react";
import Radio from "../../UI/Radio/Radio";

type PatientsGroupsToggleProps = {
  isTypeChecked: (type: string) => boolean;
  handleTypeChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PatientsGroupsToggle = ({
  isTypeChecked,
  handleTypeChanged,
}: PatientsGroupsToggleProps) => {
  return (
    <div className="patients-groups-toggle">
      <div className="patients-groups-toggle__radio">
        <Radio
          id="my-groups"
          name="patients-group-type"
          value="My groups"
          checked={isTypeChecked("My groups")}
          onChange={handleTypeChanged}
          label="My groups"
        />
      </div>
      <div className="patients-groups-toggle__radio">
        <Radio
          id="clinic-groups"
          name="patients-group-type"
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
