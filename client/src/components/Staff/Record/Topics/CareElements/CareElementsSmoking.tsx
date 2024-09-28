import { Tooltip } from "@mui/material";
import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  toCodeTableName,
  ynIndicatorsimpleCT,
} from "../../../../../omdDatas/codesTables";
import {
  CareElementHistoryTopicType,
  CareElementLastDatasType,
  CareElementType,
} from "../../../../../types/api";
import ClockIcon from "../../../../UI/Icons/ClockIcon";
import PenIcon from "../../../../UI/Icons/PenIcon";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import SmokingHistoryEdit from "./History/SmokingHistoryEdit";

type CareElementsSmokingProps = {
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

const CareElementsSmoking = ({
  careElementPut,
  datas,
  lastDatas,
  handleClickHistory,
}: CareElementsSmokingProps) => {
  //Hooks
  const [editVisible, setEditVisible] = useState(false);

  const handleEditClick = () => {
    setEditVisible(true);
  };

  return (
    <div className="care-elements__card-content-row">
      <label>Smoking:</label>
      <div className="care-elements__card-content-row-value">
        {toCodeTableName(ynIndicatorsimpleCT, lastDatas.SmokingStatus?.Status)}
      </div>
      {lastDatas.SmokingStatus?.Status && (
        <div className="care-elements__card-content-row-btns">
          <Tooltip title="Show history">
            <span>
              <ClockIcon
                onClick={() => handleClickHistory("SMOKING STATUS")}
                mr={15}
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
          title="EDIT SMOKING HISTORY"
          width={600}
          height={550}
          x={(window.innerWidth - 600) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#577399"
          setPopUpVisible={setEditVisible}
        >
          <SmokingHistoryEdit
            datas={datas}
            careElementPut={careElementPut}
            setEditVisible={setEditVisible}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CareElementsSmoking;
