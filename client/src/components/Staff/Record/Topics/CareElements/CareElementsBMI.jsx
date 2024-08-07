import { Tooltip } from "@mui/material";
import ClockIcon from "../../../../UI/Icons/ClockIcon";

const CareElementsBMI = ({ lastDatas, handleClickHistory }) => {
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
                onClick={(e) => handleClickHistory(e, "BODY MASS INDEX")}
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
