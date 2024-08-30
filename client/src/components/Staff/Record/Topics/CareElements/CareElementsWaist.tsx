import { Tooltip } from "@mui/material";
import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  CareElementHistoryTopicType,
  CareElementLastDatasType,
  CareElementType,
} from "../../../../../types/api";
import ClockIcon from "../../../../UI/Icons/ClockIcon";
import PenIcon from "../../../../UI/Icons/PenIcon";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import WaistHistoryEdit from "./History/WaistHistoryEdit";

type CareElementsWaistProps = {
  datas: CareElementType;
  lastDatas: CareElementLastDatasType;
  careElementPut: UseMutationResult<
    CareElementType,
    Error,
    CareElementType,
    void
  >;
  handleClickHistory: (rowName: CareElementHistoryTopicType) => void;
};
const CareElementsWaist = ({
  datas,
  lastDatas,
  careElementPut,
  handleClickHistory,
}: CareElementsWaistProps) => {
  //Hooks
  const [editVisible, setEditVisible] = useState(false);

  const handleEditClick = () => {
    setEditVisible(true);
  };
  return (
    <div className="care-elements__row">
      <label className="care-elements__row-label">
        Waist circumference (cm):
      </label>

      <div className="care-elements__row-value">
        {lastDatas.WaistCircumference?.WaistCircumference}
      </div>
      {lastDatas.WaistCircumference?.WaistCircumference && (
        <div className="care-elements__row-btns">
          <Tooltip title="Show history">
            <span>
              <ClockIcon
                onClick={() => handleClickHistory("WAIST CIRCUMFERENCE")}
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
          title="EDIT WAIST CIRCUMFERENCE HISTORY"
          width={550}
          height={550}
          x={(window.innerWidth - 550) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#577399"
          setPopUpVisible={setEditVisible}
        >
          <WaistHistoryEdit
            datas={datas}
            careElementPut={careElementPut}
            setEditVisible={setEditVisible}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CareElementsWaist;
