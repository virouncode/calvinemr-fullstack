import React from "react";
import { timestampToDateISOTZ } from "../../../../../../utils/dates/formatDates";
import Input from "../../../../../UI/Inputs/Input";
import InputDate from "../../../../../UI/Inputs/InputDate";

type CareElementAdditionalEditItemProps = {
  data: {
    id: string;
    Date: number;
    Value: string;
  };
  careElementAdditionalToEdit: {
    Name: string;
    Unit: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
};
const CareElementAdditionalEditItem = ({
  data,
  careElementAdditionalToEdit,
  handleChange,
}: CareElementAdditionalEditItemProps) => {
  return (
    <div className="care-elements__edit-row">
      <div className="care-elements__edit-item">
        <Input
          label={
            careElementAdditionalToEdit.Name +
            `${
              careElementAdditionalToEdit.Unit
                ? ` (${careElementAdditionalToEdit.Unit})`
                : ""
            }`
          }
          value={data.Value}
          onChange={(e) => handleChange(e, data.id)}
          name="Value"
          id="result"
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
    </div>
  );
};

export default CareElementAdditionalEditItem;
