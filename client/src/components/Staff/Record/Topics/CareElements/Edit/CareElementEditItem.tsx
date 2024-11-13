import React from "react";
import { timestampToDateISOTZ } from "../../../../../../utils/dates/formatDates";
import TrashIcon from "../../../../../UI/Icons/TrashIcon";
import Input from "../../../../../UI/Inputs/Input";
import InputDate from "../../../../../UI/Inputs/InputDate";
import { CareElementListItemType } from "../../../../../../types/api";

type CareElementEditItemProps = {
  data: {
    Date: number;
    [key: string]: string | number;
  };
  index: number;
  careElementToEdit: CareElementListItemType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  handleRemove: (index: number) => void;
};
const CareElementEditItem = ({
  data,
  careElementToEdit,
  index,
  handleChange,
  handleRemove,
}: CareElementEditItemProps) => {
  return (
    <div className="care-elements__edit-row">
      <div className="care-elements__edit-item">
        <Input
          label={careElementToEdit.name}
          value={data[careElementToEdit.valueKey] as string}
          onChange={(e) => handleChange(e, index)}
          name={careElementToEdit.valueKey}
          id="result"
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

export default CareElementEditItem;
