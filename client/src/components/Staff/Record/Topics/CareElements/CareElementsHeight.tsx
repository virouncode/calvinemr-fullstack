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
import HeightHistoryEdit from "./HeightHistoryEdit";

type CareElementsHeightProps = {
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

const CareElementsHeight = ({
  datas,
  lastDatas,
  careElementPut,
  handleClickHistory,
}: CareElementsHeightProps) => {
  //Hooks
  const [editVisible, setEditVisible] = useState(false);

  const handleEditClick = () => {
    setEditVisible(true);
  };
  return (
    <div className="care-elements__row">
      <label className="care-elements__row-label">Height (cm):</label>

      <div className="care-elements__row-value">
        {lastDatas.bodyMassIndex?.BMI}
      </div>
      {lastDatas.Height?.Height && (
        <div className="care-elements__row-btns">
          <Tooltip title="Show history">
            <span>
              <ClockIcon onClick={() => handleClickHistory("HEIGHT")} mr={5} />
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
          title="EDIT HEIGHT(cm) HISTORY"
          width={400}
          height={550}
          x={(window.innerWidth - 400) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#577399"
          setPopUpVisible={setEditVisible}
        >
          <HeightHistoryEdit
            datas={datas}
            careElementPut={careElementPut}
            setEditVisible={setEditVisible}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CareElementsHeight;
