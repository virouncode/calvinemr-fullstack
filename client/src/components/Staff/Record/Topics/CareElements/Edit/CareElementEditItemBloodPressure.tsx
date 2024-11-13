import React from "react";
import { timestampToDateISOTZ } from "../../../../../../utils/dates/formatDates";
import TrashIcon from "../../../../../UI/Icons/TrashIcon";
import Input from "../../../../../UI/Inputs/Input";
import InputDate from "../../../../../UI/Inputs/InputDate";

type CareElementEditItemBloodPressureProps = {
  data: {
    SystolicBP: string;
    DiastolicBP: string;
    Date: number;
    BPUnit: "mmHg";
  };
  index: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  handleRemove: (index: number) => void;
};

const CareElementEditItemBloodPressure = ({
  data,
  index,
  handleChange,
  handleRemove,
}: CareElementEditItemBloodPressureProps) => {
  return (
    <div className="care-elements__edit-row">
      <div className="care-elements__edit-item">
        <Input
          label="Systolic"
          value={data.SystolicBP}
          onChange={(e) => handleChange(e, index)}
          name="Systolic"
          id="systolic"
        />
      </div>
      <div className="care-elements__edit-item">
        <Input
          label="Diastolic"
          value={data.DiastolicBP}
          onChange={(e) => handleChange(e, index)}
          name="Diastolic"
          id="systolic"
        />
      </div>
      <div className="care-elements__edit-item">
        <InputDate
          label="Date"
          value={timestampToDateISOTZ(data.Date)}
          onChange={(e) => handleChange(e, index)}
          name="Date"
          id="date"
        />
      </div>
      <div
        className="care-elements__edit-item"
        style={{ alignSelf: "flex-start" }}
      >
        <TrashIcon onClick={(e) => handleRemove(index)} />
      </div>
    </div>
  );
};

export default CareElementEditItemBloodPressure;
