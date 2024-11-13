import React from "react";
import { ynIndicatorsimpleCT } from "../../../../../../omdDatas/codesTables";
import { timestampToDateISOTZ } from "../../../../../../utils/dates/formatDates";
import Input from "../../../../../UI/Inputs/Input";
import InputDate from "../../../../../UI/Inputs/InputDate";
import GenericList from "../../../../../UI/Lists/GenericList";
import TrashIcon from "../../../../../UI/Icons/TrashIcon";

type CareElementEditItemSmokingProps = {
  dataStatus: {
    Date: number;
    Status: string;
  };
  dataPacks?: {
    Date: number;
    PerDay: string;
  };
  index: number;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => void;
  handleRemove: (index: number) => void;
};
const CareElementEditItemSmoking = ({
  dataStatus,
  dataPacks,
  index,
  handleChange,
  handleRemove,
}: CareElementEditItemSmokingProps) => {
  return (
    <div className="care-elements__edit-row">
      <div className="care-elements__edit-item">
        <GenericList
          list={ynIndicatorsimpleCT}
          name="Status"
          handleChange={(e) => handleChange(e, index)}
          value={dataStatus.Status}
          noneOption={false}
          label="Status"
          placeHolder="Choose..."
          id="status"
        />
      </div>
      <div className="care-elements__edit-item">
        <Input
          label="Packs Per Day"
          value={dataPacks?.PerDay ?? ""}
          onChange={(e) => handleChange(e, index)}
          name="PerDay"
          id="packs"
        />
      </div>
      <div className="care-elements__edit-item">
        <InputDate
          label="Date"
          value={timestampToDateISOTZ(dataStatus.Date)}
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

export default CareElementEditItemSmoking;
