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
import BPHistoryEdit from "./History/BPHistoryEdit";

type CareElementsSystolicProps = {
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

const CareElementsSystolic = ({
  datas,
  lastDatas,
  careElementPut,
  handleClickHistory,
}: CareElementsSystolicProps) => {
  //Hooks
  const [editVisible, setEditVisible] = useState(false);

  const handleEditClick = () => {
    setEditVisible(true);
  };
  return (
    <div className="care-elements__card-content-row">
      <label className="care-elements__card-content-row-label">
        Systolic (mmHg):
      </label>

      <div className="care-elements__card-content-row-value">
        {lastDatas.BloodPressure?.SystolicBP}
      </div>
      {lastDatas.BloodPressure?.SystolicBP && (
        <div className="care-elements__card-content-row-btns">
          <Tooltip title="Show history">
            <span>
              <ClockIcon
                onClick={() => handleClickHistory("BLOOD PRESSURE")}
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
          title="EDIT BLOOD PRESSURE HISTORY"
          width={700}
          height={550}
          x={(window.innerWidth - 700) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#577399"
          setPopUpVisible={setEditVisible}
        >
          <BPHistoryEdit
            datas={datas}
            careElementPut={careElementPut}
            setEditVisible={setEditVisible}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CareElementsSystolic;
