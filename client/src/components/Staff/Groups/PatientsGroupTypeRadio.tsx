import React from "react";
import { GroupType } from "../../../types/api";
import Radio from "../../UI/Radio/Radio";

type PatientsGroupTypeRadioProps = {
  groupInfos: Partial<GroupType>;
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
          name="global"
          value="false"
          checked={!groupInfos.global}
          onChange={handleChangeType}
          label="Personal Group"
        />
      </div>
      <div className="patients-groups__edit-row-radio-item">
        <Radio
          id="global"
          name="global"
          value="true"
          checked={!!groupInfos.global}
          onChange={handleChangeType}
          label="Clinic Group"
        />
      </div>
    </div>
  );
};

export default PatientsGroupTypeRadio;
