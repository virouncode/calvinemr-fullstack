import React from "react";
import { CareElementListItemType } from "../../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../../utils/dates/formatDates";
import TrashIcon from "../../../../../UI/Icons/TrashIcon";
import Input from "../../../../../UI/Inputs/Input";
import InputDate from "../../../../../UI/Inputs/InputDate";

type CareElementEditItemProps = {
  data: {
    id: string;
    Date: number;
    [key: string]: string | number;
  };
  careElementToEdit: CareElementListItemType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  handleRemove: (id: string) => void;
};
const CareElementEditItem = ({
  data,
  careElementToEdit,
  handleChange,
  handleRemove,
}: CareElementEditItemProps) => {
  return (
    <div className="care-elements__edit-row">
      <div className="care-elements__edit-item">
        <Input
          label={careElementToEdit.name}
          value={data[careElementToEdit.valueKey] as string}
          onChange={(e) => handleChange(e, data.id)}
          name={careElementToEdit.valueKey}
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
      <div
        className="care-elements__edit-item"
        style={{ alignSelf: "flex-start" }}
      >
        <TrashIcon onClick={(e) => handleRemove(data.id)} />
      </div>
    </div>
  );
};

export default CareElementEditItem;
