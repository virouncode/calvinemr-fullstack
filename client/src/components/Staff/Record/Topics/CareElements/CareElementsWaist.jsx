import { Tooltip } from "@mui/material";
import { useState } from "react";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import WaistHistoryEdit from "./WaistHistoryEdit";

const CareElementsWaist = ({
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
      <label className="care-elements__row-label">
        Waist circumference (cm):
      </label>

      <div className="care-elements__row-value">
        {lastDatas.WaistCircumference?.WaistCircumference}
      </div>
      {lastDatas.WaistCircumference?.WaistCircumference && (
        <div className="care-elements__row-btns">
          <Tooltip title="Show history">
            <i
              className="fa-solid fa-clock-rotate-left"
              onClick={(e) => handleClickHistory(e, "WAIST CIRCUMFERENCE")}
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
          title="EDIT WAIST CIRCUMFERENCE HISTORY"
          width={550}
          height={550}
          x={(window.innerWidth - 550) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#577399"
          setPopUpVisible={setEditVisible}
        >
          <WaistHistoryEdit
            datas={datas}
            careElementPut={careElementPut}
            setEditVisible={setEditVisible}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CareElementsWaist;
