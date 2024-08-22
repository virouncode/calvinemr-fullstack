import { Tooltip } from "@mui/material";
import React from "react";
import {
  CareElementHistoryTopicType,
  CareElementLastDatasType,
} from "../../../../../types/api";
import ClockIcon from "../../../../UI/Icons/ClockIcon";

type CareElementsBSAProps = {
  lastDatas: CareElementLastDatasType;
  handleClickHistory: (rowName: CareElementHistoryTopicType) => void;
};

const CareElementsBSA = ({
  lastDatas,
  handleClickHistory,
}: CareElementsBSAProps) => {
  return (
    <div className="care-elements__row">
      <label className="care-elements__row-label">
        Body surface area (m2):
      </label>
      <div className="care-elements__row-value">
        {lastDatas.bodySurfaceArea?.BSA}
      </div>
      {lastDatas.bodySurfaceArea?.BSA && (
        <div className="care-elements__row-btns">
          <Tooltip title="Show history">
            <span>
              <ClockIcon
                onClick={() => handleClickHistory("BODY SURFACE AREA")}
                mr={5}
              />
            </span>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default CareElementsBSA;
