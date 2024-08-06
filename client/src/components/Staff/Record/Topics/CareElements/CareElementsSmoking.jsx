import { Tooltip } from "@mui/material";
import { useState } from "react";
import {
  toCodeTableName,
  ynIndicatorsimpleCT,
} from "../../../../../omdDatas/codesTables";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import SmokingHistoryEdit from "./SmokingHistoryEdit";

const CareElementsSmoking = ({
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
      <label className="care-elements__row-label">Smoking:</label>
      <div className="care-elements__row-value">
        {toCodeTableName(ynIndicatorsimpleCT, lastDatas.SmokingStatus?.Status)}
      </div>
      {lastDatas.SmokingStatus?.Status && (
        <div className="care-elements__row-btns">
          <Tooltip title="Show history">
            <i
              className="fa-solid fa-clock-rotate-left"
              onClick={(e) => handleClickHistory(e, "SMOKING STATUS")}
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
          title="EDIT SMOKING HISTORY"
          width={600}
          height={550}
          x={(window.innerWidth - 600) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#577399"
          setPopUpVisible={setEditVisible}
        >
          <SmokingHistoryEdit
            datas={datas}
            careElementPut={careElementPut}
            setEditVisible={setEditVisible}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CareElementsSmoking;
