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
import LHHistoryEdit from "./History/LHHistoryEdit";

type CareElementsLHProps = {
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
const CareElementsLH = ({
  datas,
  lastDatas,
  careElementPut,
  handleClickHistory,
}: CareElementsLHProps) => {
  //Hooks
  const [editVisible, setEditVisible] = useState(false);

  const handleEditClick = () => {
    setEditVisible(true);
  };
  return (
    <div className="care-elements__card-content-row">
      <label className="care-elements__card-content-row-label">
        LH (IU/L):
      </label>
      <div className="care-elements__card-content-row-value">
        {lastDatas.LH?.LH}
      </div>
      {lastDatas.LH?.LH && (
        <div className="care-elements__card-content-row-btns">
          <Tooltip title="Show history">
            <span>
              <ClockIcon onClick={() => handleClickHistory("LH")} mr={15} />
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
          title="EDIT LH HISTORY"
          width={550}
          height={550}
          x={(window.innerWidth - 550) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#577399"
          setPopUpVisible={setEditVisible}
        >
          <LHHistoryEdit
            datas={datas}
            careElementPut={careElementPut}
            setEditVisible={setEditVisible}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CareElementsLH;
