import { Tooltip } from "@mui/material";


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
            <i
              className="fa-solid fa-clock-rotate-left"
              onClick={(e) => handleClickHistory(e, "BODY SURFACE AREA")}
              style={{ marginRight: "5px" }}
            />
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default CareElementsBSA;
