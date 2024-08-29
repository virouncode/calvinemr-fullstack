import { Tooltip } from "@mui/material";
import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import { CareElementType } from "../../../../../types/api";
import ClockIcon from "../../../../UI/Icons/ClockIcon";
import PenIcon from "../../../../UI/Icons/PenIcon";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import CareElementAdditionalHistoryEdit from "./CareElementAdditionalHistoryEdit";

type CareElementsAdditionalProps = {
  datas: CareElementType;
  lastAdditionalData: {
    Data: {
      Value: string;
      Date: number;
    };
    Name: string;
    Unit: string;
  };
  careElementPut: UseMutationResult<
    CareElementType,
    Error,
    CareElementType,
    void
  >;
  handleClickAdditionalHistory: (rowName: string) => void;
};

const CareElementsAdditional = ({
  datas,
  lastAdditionalData,
  careElementPut,
  handleClickAdditionalHistory,
}: CareElementsAdditionalProps) => {
  //Hooks
  const [editVisible, setEditVisible] = useState(false);

  const handleEditClick = () => {
    setEditVisible(true);
  };
  return (
    <div className="care-elements__row">
      <label className="care-elements__row-label">
        {lastAdditionalData.Name} ({lastAdditionalData.Unit}):
      </label>
      <div className="care-elements__row-value">
        {lastAdditionalData.Data?.Value}
      </div>
      {lastAdditionalData.Data?.Value && (
        <div className="care-elements__row-btns">
          <Tooltip title="Show history">
            <span>
              <ClockIcon
                onClick={() =>
                  handleClickAdditionalHistory(lastAdditionalData.Name)
                }
                mr={5}
              />
            </span>
          </Tooltip>
          <Tooltip title="Edit history">
            <span>
              <PenIcon onClick={handleEditClick} />
            </span>
          </Tooltip>
        </div>
      )}
      {editVisible && (
        <FakeWindow
          title={`EDIT ${lastAdditionalData.Name.toUpperCase()} HISTORY`}
          width={550}
          height={550}
          x={(window.innerWidth - 550) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#577399"
          setPopUpVisible={setEditVisible}
        >
          <CareElementAdditionalHistoryEdit
            datas={datas}
            careElementPut={careElementPut}
            setEditVisible={setEditVisible}
            lastAdditionalData={lastAdditionalData}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CareElementsAdditional;
