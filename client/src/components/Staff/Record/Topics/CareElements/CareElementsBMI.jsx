import { Tooltip } from "@mui/material";


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
            <i
              className="fa-solid fa-clock-rotate-left"
              onClick={(e) => handleClickHistory(e, "BODY MASS INDEX")}
              style={{ marginRight: "5px" }}
            />
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default CareElementsBMI;
