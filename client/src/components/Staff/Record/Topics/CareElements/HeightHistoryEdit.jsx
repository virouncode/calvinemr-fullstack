import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
    dateISOToTimestampTZ,
    nowTZTimestamp,
    timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { bodyMassIndex } from "../../../../../utils/measurements/measurements";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";

const HeightHistoryEdit = ({ datas, careElementPut, setEditVisible }) => {
  const { user } = useUserContext();
  const [formDatasHeight, setFormDatasHeight] = useState(
    datas?.Height.map((item, index) => {
      return { ...item, id: index };
    })
  );
  const [formDatasBodyMassIndex, setFormDatasBodyMassIndex] = useState(
    datas?.bodyMassIndex?.map((item, index) => {
      return { ...item, id: index };
    })
  );
  const [formDatasBodySurfaceArea, setFormDatasBodySurfaceArea] = useState(
    datas?.bodySurfaceArea?.map((item, index) => {
      return { ...item, id: index };
    })
  );
  const [errMsgPost, setErrMsgPost] = useState("");
  const handleClose = () => {
    setEditVisible(false);
  };
  const handleChange = (e) => {
    setErrMsgPost("");
    const id = e.target.id;
    let value = e.target.value;
    const name = e.target.name;
    let lastWeight = 0;
    switch (name) {
      case "Height":
        lastWeight =
          datas.Weight?.filter(
            ({ Date }) =>
              Date <=
              formDatasHeight.find((item) => item.id === parseInt(id))?.Date
          )
            ?.sort((a, b) => a.Date - b.Date)
            ?.at(-1)?.Weight || 0;
        setFormDatasHeight(
          formDatasHeight.map((item) => {
            return item.id === parseInt(id) ? { ...item, Height: value } : item;
          })
        );
        setFormDatasBodyMassIndex(
          formDatasBodyMassIndex.map((item) => {
            return item.id === parseInt(id)
              ? { ...item, BMI: bodyMassIndex(value, lastWeight) }
              : item;
          })
        );
        setFormDatasBodySurfaceArea(
          formDatasBodySurfaceArea.map((item) => {
            return item.id === parseInt(id)
              ? { ...item, BSA: bodyMassIndex(value, lastWeight) }
              : item;
          })
        );
        break;
      case "Date":
        lastWeight =
          datas.Weight?.filter(
            ({ Date }) => Date <= dateISOToTimestampTZ(value)
          )
            ?.sort((a, b) => a.Date - b.Date)
            ?.at(-1)?.Height || 0;

        setFormDatasHeight(
          formDatasHeight.map((item) => {
            return item.id === parseInt(id)
              ? { ...item, Date: dateISOToTimestampTZ(value) }
              : item;
          })
        );
        setFormDatasBodyMassIndex(
          formDatasBodyMassIndex.map((item) => {
            return item.id === parseInt(id)
              ? {
                  ...item,
                  BMI: bodyMassIndex(
                    formDatasHeight.find(({ id }) => id === parseInt(id))
                      .Height,
                    lastWeight
                  ),
                  Date: dateISOToTimestampTZ(value),
                }
              : item;
          })
        );
        setFormDatasBodySurfaceArea(
          formDatasBodySurfaceArea.map((item) => {
            return item.id === parseInt(id)
              ? {
                  ...item,
                  BSA: bodyMassIndex(
                    formDatasHeight.find(({ id }) => id === parseInt(id))
                      .Height,
                    lastWeight
                  ),
                  Date: dateISOToTimestampTZ(value),
                }
              : item;
          })
        );
        break;
      default:
        break;
    }
  };
  const handleSubmit = async () => {
    //Validation
    if (formDatasHeight.some(({ Height, Date }) => !Height || !Date)) {
      setErrMsgPost("Please fill both Height and Date fields");
      return;
    }
    if (
      formDatasHeight.some(({ Height }) => !Height.match(/^\d+([.,]\d{0,2})?$/))
    ) {
      setErrMsgPost("Please enter a valid number for Height");
      return;
    }
    const careElementToPut = {
      ...datas,
      Height: formDatasHeight,
      bodyMassIndex: formDatasBodyMassIndex,
      bodySurfaceArea: formDatasBodySurfaceArea,
      updates: [
        ...datas.updates,
        { date_updated: nowTZTimestamp(), updated_by_id: user.id },
      ],
    };
    careElementPut.mutate(careElementToPut, {
      onSuccess: () => setEditVisible(false),
    });
  };
  return (
    <div className="care-elements__edit">
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <ul
        className="care-elements__edit-list"
        style={{ border: errMsgPost && "solid 1px red" }}
      >
        {formDatasHeight.map((item) => (
          <li className="care-elements__edit-item" key={item.id}>
            <span className="care-elements__edit-block care-elements__edit-block--double">
              <label>Date: </label>
              <input
                type="date"
                value={timestampToDateISOTZ(
                  formDatasHeight.find(({ id }) => id === item.id).Date
                )}
                onChange={handleChange}
                id={item.id}
                name="Date"
              />
            </span>
            <span className="care-elements__edit-block care-elements__edit-block--double">
              <label>Height (cm): </label>
              <input
                type="text"
                value={formDatasHeight.find(({ id }) => id === item.id).Height}
                onChange={handleChange}
                id={item.id}
                name="Height"
              />
            </span>
          </li>
        ))}
      </ul>
      <div className="care-elements__edit-btns">
        <button className="save-btn" onClick={handleSubmit}>
          Save
        </button>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default HeightHistoryEdit;
