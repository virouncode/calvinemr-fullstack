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
    <div className="care-elements__row">
      <label className="care-elements__row-label">
        Body mass index (kg/m2):
      </label>
      <div className="care-elements__row-value">
        {lastDatas.bodyMassIndex?.BMI}
      </div>
      {lastDatas.bodyMassIndex?.BMI && (
        <div className="care-elements__row-btns">
          <Tooltip title="Show history">
            <span>
              <ClockIcon
                onClick={() => handleClickHistory("BODY MASS INDEX")}
                mr={5}
              />
            </span>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default CareElementsBMI;
