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
import E2HistoryEdit from "./History/E2HistoryEdit";

type CareElementsE2Props = {
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
const CareElementsE2 = ({
  datas,
  lastDatas,
  careElementPut,
  handleClickHistory,
}: CareElementsE2Props) => {
  //Hooks
  const [editVisible, setEditVisible] = useState(false);

  const handleEditClick = () => {
    setEditVisible(true);
  };
  return (
    <div className="care-elements__card-content-row">
      <label className="care-elements__card-content-row-label">
        E2 (pmol/ml):
      </label>
      <div className="care-elements__card-content-row-value">
        {lastDatas.E2?.E2}
      </div>
      {lastDatas.E2?.E2 && (
        <div className="care-elements__card-content-row-btns">
          <Tooltip title="Show history">
            <span>
              <ClockIcon onClick={() => handleClickHistory("E2")} mr={15} />
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
          title="EDIT E2 HISTORY"
          width={550}
          height={550}
          x={(window.innerWidth - 550) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#577399"
          setPopUpVisible={setEditVisible}
        >
          <E2HistoryEdit
            datas={datas}
            careElementPut={careElementPut}
            setEditVisible={setEditVisible}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CareElementsE2;
