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
    <div className="care-elements__card-content-row">
      <label className="care-elements__card-content-row-label">
        Body surface area (m2):
      </label>
      <div className="care-elements__card-content-row-value">
        {lastDatas.bodySurfaceArea?.BSA}
      </div>
      {lastDatas.bodySurfaceArea?.BSA && (
        <div className="care-elements__card-content-row-btns">
          <Tooltip title="Show history">
            <span>
              <ClockIcon
                onClick={() => handleClickHistory("BODY SURFACE AREA")}
                mr={15}
              />
            </span>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default CareElementsBSA;
