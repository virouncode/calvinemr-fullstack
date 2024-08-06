import { Tooltip } from "@mui/material";
import { useState } from "react";
import { cmToFeet } from "../../../../../utils/measurements/measurements";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import HeightFeetHistoryEdit from "./HeightFeetHistoryEdit";

const CareElementsHeightFeet = ({
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
      <label className="care-elements__row-label">Height (feet):</label>
      <div className="care-elements__row-value">
        {cmToFeet(lastDatas.Height?.Height)}
      </div>
      {lastDatas.Height?.Height && (
        <div className="care-elements__row-btns">
          <Tooltip title="Show history">
            <i
              className="fa-solid fa-clock-rotate-left"
              onClick={(e) => handleClickHistory(e, "HEIGHT FEET")}
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
          title="EDIT HEIGHT(feet) HISTORY"
          width={400}
          height={550}
          x={(window.innerWidth - 400) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#577399"
          setPopUpVisible={setEditVisible}
        >
          <HeightFeetHistoryEdit
            datas={datas}
            careElementPut={careElementPut}
            setEditVisible={setEditVisible}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CareElementsHeightFeet;
