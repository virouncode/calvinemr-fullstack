import { Tooltip } from "@mui/material";
import { useState } from "react";
import ClockIcon from "../../../../UI/Icons/ClockIcon";
import PenIcon from "../../../../UI/Icons/PenIcon";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import WeightHistoryEdit from "./WeightHistoryEdit";

const CareElementsWeight = ({
  careElementPut,
  datas,
  lastDatas,
  handleClickHistory,
}) => {
  const [editVisible, setEditVisible] = useState(false);
  const handleEditClick = () => {
    setEditVisible(true);
  };
  return (
    <div className="care-elements__row">
      <label className="care-elements__row-label">Weight (kg):</label>
      <div className="care-elements__row-value">{lastDatas.Weight?.Weight}</div>
      {lastDatas.Weight?.Weight && (
        <div className="care-elements__row-btns">
          <Tooltip title="Show history">
            <span>
              <ClockIcon
                onClick={(e) => handleClickHistory(e, "WEIGHT")}
                mr={5}
              />
            </span>
          </Tooltip>
          <Tooltip title="Edit history">
            <span>
              <PenIcon onClick={handleEditClick} />
            </span>
          </Tooltip>
        </div>
      )}
      {editVisible && (
        <FakeWindow
          title="EDIT WEIGHT (kg) HISTORY"
          width={400}
          height={550}
          x={(window.innerWidth - 400) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#577399"
          setPopUpVisible={setEditVisible}
        >
          <WeightHistoryEdit
            datas={datas}
            careElementPut={careElementPut}
            setEditVisible={setEditVisible}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CareElementsWeight;
