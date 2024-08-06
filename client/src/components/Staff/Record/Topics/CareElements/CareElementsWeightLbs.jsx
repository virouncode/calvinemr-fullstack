import { Tooltip } from "@mui/material";
import { useState } from "react";
import { kgToLbs } from "../../../../../utils/measurements/measurements";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import WeightLbsHistoryEdit from "./WeightLbsHistoryEdit";

const CareElementsWeightLbs = ({
  datas,
  lastDatas,
  careElementPut,
  handleClickHistory,
}) => {
  const [editVisible, setEditVisible] = useState(false);
  const handleEditClick = () => {
    setEditVisible(true);
  };
  return (
    <div className="care-elements__row">
      <label className="care-elements__row-label">Weight (lbs):</label>
      <div className="care-elements__row-value">
        {kgToLbs(lastDatas.Weight?.Weight)}
      </div>
      {lastDatas.Weight?.Weight && (
        <div className="care-elements__row-btns">
          <Tooltip title="Show history">
            <i
              className="fa-solid fa-clock-rotate-left"
              onClick={(e) => handleClickHistory(e, "WEIGHT LBS")}
              style={{ marginRight: "5px" }}
            />
          </Tooltip>
          <Tooltip title="Edit history">
            <i
              className="fa-regular fa-pen-to-square"
              onClick={handleEditClick}
            />
          </Tooltip>
        </div>
      )}
      {editVisible && (
        <FakeWindow
          title="EDIT WEIGHT (lbs) HISTORY"
          width={400}
          height={550}
          x={(window.innerWidth - 400) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#577399"
          setPopUpVisible={setEditVisible}
        >
          <WeightLbsHistoryEdit
            datas={datas}
            careElementPut={careElementPut}
            setEditVisible={setEditVisible}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CareElementsWeightLbs;
