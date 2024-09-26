import { Tooltip } from "@mui/material";
import React from "react";
import {
  CareElementHistoryTopicType,
  CareElementLastDatasType,
} from "../../../../../types/api";
import ClockIcon from "../../../../UI/Icons/ClockIcon";

type CareElementsBMIProps = {
  lastDatas: CareElementLastDatasType;
  handleClickHistory: (rowName: CareElementHistoryTopicType) => void;
};

const CareElementsBMI = ({
  lastDatas,
  handleClickHistory,
}: CareElementsBMIProps) => {
  return (
    <div className="care-elements__card-content-row">
      <label className="care-elements__card-content-row-label">
        Body mass index (kg/m2):
      </label>
      <div className="care-elements__card-content-row-value">
        {lastDatas.bodyMassIndex?.BMI}
      </div>
      {lastDatas.bodyMassIndex?.BMI && (
        <div className="care-elements__card-content-row-btns">
          <Tooltip title="Show history">
            <span>
              <ClockIcon
                onClick={() => handleClickHistory("BODY MASS INDEX")}
                mr={15}
              />
            </span>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default CareElementsBMI;
