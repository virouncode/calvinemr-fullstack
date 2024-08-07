import { Tooltip } from "@mui/material";
import ClockIcon from "../../../../UI/Icons/ClockIcon";

const CareElementsBSA = ({ lastDatas, handleClickHistory }) => {
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
                onClick={(e) => handleClickHistory(e, "BODY SURFACE AREA")}
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
