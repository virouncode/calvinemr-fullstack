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
import TSHHistoryEdit from "./History/TSHHistoryEdit";

type CareElementsTSHProps = {
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
const CareElementsTSH = ({
  datas,
  lastDatas,
  careElementPut,
  handleClickHistory,
}: CareElementsTSHProps) => {
  //Hooks
  const [editVisible, setEditVisible] = useState(false);

  const handleEditClick = () => {
    setEditVisible(true);
  };
  return (
    <div className="care-elements__card-content-row">
      <label className="care-elements__card-content-row-label">
        TSH (uIU/mL):
      </label>
      <div className="care-elements__card-content-row-value">
        {lastDatas.TSH?.TSH}
      </div>
      {lastDatas.TSH?.TSH && (
        <div className="care-elements__card-content-row-btns">
          <Tooltip title="Show history">
            <span>
              <ClockIcon onClick={() => handleClickHistory("TSH")} mr={15} />
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
          title="EDIT TSH HISTORY"
          width={550}
          height={550}
          x={(window.innerWidth - 550) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#577399"
          setPopUpVisible={setEditVisible}
        >
          <TSHHistoryEdit
            datas={datas}
            careElementPut={careElementPut}
            setEditVisible={setEditVisible}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CareElementsTSH;
