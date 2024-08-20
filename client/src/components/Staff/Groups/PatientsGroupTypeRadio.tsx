import React from "react";
import { GroupType } from "../../../types/api";
import Radio from "../../UI/Radio/Radio";

type PatientsGroupTypeRadioProps = {
  groupInfos: GroupType;
  handleChangeType: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PatientsGroupTypeRadio = ({
  groupInfos,
  handleChangeType,
}: PatientsGroupTypeRadioProps) => {
  return (
    <div className="patients-groups__edit-row-radio">
      <div className="patients-groups__edit-row-radio-item">
        <Radio
          id="personal"
          name="personal"
          value="personal"
          checked={!groupInfos.global}
          onChange={handleChangeType}
          label="Personal Group"
        />
      </div>
      <div className="patients-groups__edit-row-radio-item">
        <Radio
          id="global"
          name="global"
          value="global"
          checked={groupInfos.global}
          onChange={handleChangeType}
          label="Clinic Group"
        />
      </div>
    </div>
  );
};

export default PatientsGroupTypeRadio;
