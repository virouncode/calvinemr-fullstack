import React from "react";
import { timestampToDateISOTZ } from "../../../../../../utils/dates/formatDates";
import TrashIcon from "../../../../../UI/Icons/TrashIcon";
import Input from "../../../../../UI/Inputs/Input";
import InputDate from "../../../../../UI/Inputs/InputDate";

type CareElementEditItemMeasurementsProps = {
  dataKg: {
    WeightUnit: "kg";
    Date: number;
    Weight: string;
  };
  dataLbs?: {
    WeightUnit: "lbs";
    Date: number;
    Weight: string;
  };
  dataCm?: {
    Height: string;
    Date: number;
    HeightUnit: "cm";
  };
  dataFtIn?: {
    Height: string;
    Date: number;
    HeightUnit: "ft in";
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  handleRemove: (index: number) => void;
  index: number;
};

const CareElementEditItemMeasurements = ({
  dataKg,
  dataLbs,
  dataCm,
  dataFtIn,
  handleChange,
  handleRemove,
  index,
}: CareElementEditItemMeasurementsProps) => {
  return (
    <div className="care-elements__edit-row">
      <div className="care-elements__edit-item">
        <Input
          label="Weight (kg)"
          value={dataKg.Weight}
          onChange={(e) => handleChange(e, index)}
          name="kg"
          id="kg"
        />
      </div>
      <div className="care-elements__edit-item">
        <Input
          label="Weight (lbs)"
          value={dataLbs?.Weight ?? ""}
          onChange={(e) => handleChange(e, index)}
          name="lbs"
          id="lbs"
        />
      </div>
      <div className="care-elements__edit-item">
        <Input
          label="Height (cm)"
          value={dataCm?.Height ?? ""}
          onChange={(e) => handleChange(e, index)}
          name="cm"
          id="cm"
        />
      </div>
      <div className="care-elements__edit-item">
        <Input
          label="Height (ft in)"
          value={dataFtIn?.Height ?? ""}
          onChange={(e) => handleChange(e, index)}
          name="ft in"
          id="ft in"
        />
      </div>
      <div className="care-elements__edit-item">
        <InputDate
          label="Date"
          value={timestampToDateISOTZ(dataKg.Date)}
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

export default CareElementEditItemMeasurements;
