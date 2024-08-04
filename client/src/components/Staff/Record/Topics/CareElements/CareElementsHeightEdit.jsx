import { useState } from "react";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import {
  bodyMassIndex,
  bodySurfaceArea,
} from "../../../../../utils/measurements/measurements";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";

const CareElementsHeightEdit = ({
  heightDatas,
  weightDatas,
  bmiDatas,
  bsaDatas,
  topic,
  unit,
  handleSaveEditHeight,
  setEditVisible,
}) => {
  const [heightFormDatas, setHeightFormDatas] = useState(heightDatas);
  const [bmiFormDatas, setBMIFormDatas] = useState(bmiDatas);
  const [bsaFormDatas, setBSAFormDatas] = useState(bsaDatas);

  const handleChange = (e) => {
    const id = parseInt(e.target.id);
    let value = e.target.value;
    const name = e.target.name;

    if (name === "Date")
      value = e.target.value ? dateISOToTimestampTZ(e.target.value) : "";
    setHeightFormDatas(
      heightFormDatas.map((item) =>
        item.id === id ? { ...item, [name]: value } : item
      )
    );
    setBMIFormDatas(
      bmiFormDatas.map((item) => {
        return item.id === id
          ? {
              ...item,
              Date: name === "Date" ? value : item.Date,
              BMI:
                name === "Date"
                  ? item.BMI
                  : bodyMassIndex(
                      value,
                      weightDatas.find((Weight) => Weight.id === id).Weight
                    ),
            }
          : item;
      })
    );
    setBSAFormDatas(
      bsaFormDatas.map((item) => {
        return item.id === id
          ? {
              ...item,
              Date: name === "Date" ? value : item.Date,
              BSA:
                name === "Date"
                  ? item.BSA
                  : bodySurfaceArea(
                      value,
                      weightDatas.find((Weight) => Weight.id === id).Weight
                    ),
            }
          : item;
      })
    );
  };
  const handleCancel = (e) => {
    setEditVisible(false);
  };

  return (
    <div className="care-elements__edit">
      <ul className="care-elements__edit-list">
        {heightFormDatas.map((item) => (
          <li key={item.id} className="care-elements__edit-item">
            <label>Date</label>
            <input
              type="date"
              value={timestampToDateISOTZ(item.Date)}
              onChange={handleChange}
              id={item.id}
              name="Date"
            />
            <label>
              {topic} ({unit})
            </label>
            <input
              type="text"
              value={item.Height}
              onChange={handleChange}
              name={topic}
              id={item.id}
            />
          </li>
        ))}
      </ul>
      <div className="care-elements__edit-btns">
        <SaveButton
          onClick={(e) =>
            handleSaveEditHeight(
              e,
              topic,
              heightFormDatas,
              bmiFormDatas,
              bsaFormDatas
            )
          }
        />
        <CancelButton onClick={handleCancel} />
      </div>
    </div>
  );
};

export default CareElementsHeightEdit;
