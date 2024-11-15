import React from "react";
import { timestampToDateISOTZ } from "../../../../../../utils/dates/formatDates";
import TrashIcon from "../../../../../UI/Icons/TrashIcon";
import Input from "../../../../../UI/Inputs/Input";
import InputDate from "../../../../../UI/Inputs/InputDate";

type CareElementEditItemBloodPressureProps = {
  data: {
    id: string;
    SystolicBP: string;
    DiastolicBP: string;
    Date: number;
    BPUnit: "mmHg";
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  handleRemove: (id: string) => void;
};

const CareElementEditItemBloodPressure = ({
  data,
  handleChange,
  handleRemove,
}: CareElementEditItemBloodPressureProps) => {
  return (
    <div className="care-elements__edit-row">
      <div className="care-elements__edit-item">
        <Input
          label="Systolic"
          value={data.SystolicBP}
          onChange={(e) => handleChange(e, data.id)}
          name="Systolic"
          id="systolic"
        />
      </div>
      <div className="care-elements__edit-item">
        <Input
          label="Diastolic"
          value={data.DiastolicBP}
          onChange={(e) => handleChange(e, data.id)}
          name="Diastolic"
          id="systolic"
        />
      </div>
      <div className="care-elements__edit-item">
        <InputDate
          label="Date"
          value={timestampToDateISOTZ(data.Date)}
          onChange={(e) => handleChange(e, data.id)}
          name="Date"
          id="date"
        />
      </div>
      <div
        className="care-elements__edit-item"
        style={{ alignSelf: "flex-start" }}
      >
        <TrashIcon onClick={(e) => handleRemove(data.id)} />
      </div>
    </div>
  );
};

export default CareElementEditItemBloodPressure;
