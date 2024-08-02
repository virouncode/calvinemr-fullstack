import { Tooltip } from "@mui/material";
import { useState } from "react";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import BPHistoryEdit from "./BPHistoryEdit";

const CareElementsDiastolic = ({
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
      <label className="care-elements__row-label">Diastolic (mmHg):</label>

      <div className="care-elements__row-value">
        {lastDatas.BloodPressure?.DiastolicBP}
      </div>
      {lastDatas.BloodPressure?.DiastolicBP && (
        <div className="care-elements__row-btns">
          <Tooltip title="Show history">
            <i
              className="fa-solid fa-clock-rotate-left"
              onClick={(e) => handleClickHistory(e, "BLOOD PRESSURE")}
              style={{ marginRight: "5px" }}
            />
          </Tooltip>
          <Tooltip title="Edit history">
            <i
              className="fa-solid fa-pen-to-square"
              onClick={handleEditClick}
            />
          </Tooltip>
        </div>
      )}
      {editVisible && (
        <FakeWindow
          title="EDIT BLOOD PRESSURE HISTORY"
          width={700}
          height={550}
          x={(window.innerWidth - 700) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#577399"
          setPopUpVisible={setEditVisible}
        >
          <BPHistoryEdit
            datas={datas}
            careElementPut={careElementPut}
            setEditVisible={setEditVisible}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CareElementsDiastolic;
