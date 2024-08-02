import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
    dateISOToTimestampTZ,
    nowTZTimestamp,
    timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";

const WaistHistoryEdit = ({ datas, careElementPut, setEditVisible }) => {
  const { user } = useUserContext();
  const [formDatasWaist, setFormDatasWaist] = useState(
    datas?.WaistCircumference.map((item, index) => {
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
    switch (name) {
      case "Waist":
        setFormDatasWaist(
          formDatasWaist.map((item) => {
            return item.id === parseInt(id)
              ? { ...item, WaistCircumference: value }
              : item;
          })
        );
        break;
      case "Date":
        setFormDatasWaist(
          formDatasWaist.map((item) => {
            return item.id === parseInt(id)
              ? { ...item, Date: dateISOToTimestampTZ(value) }
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
    if (
      formDatasWaist.some(
        ({ WaistCircumference, Date }) => !WaistCircumference || !Date
      )
    ) {
      setErrMsgPost("Please fill both Waist and Date fields");
      return;
    }
    if (
      formDatasWaist.some(
        ({ WaistCircumference }) =>
          !WaistCircumference.match(/^\d+([.,]\d{0,2})?$/)
      )
    ) {
      setErrMsgPost("Please enter a valid number for Waist Circumference");
      return;
    }
    const careElementToPut = {
      ...datas,
      WaistCircumference: formDatasWaist,
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
        {formDatasWaist.map((item) => (
          <li className="care-elements__edit-item" key={item.id}>
            <span className="care-elements__edit-block care-elements__edit-block--double">
              <label>Date: </label>
              <input
                type="date"
                value={timestampToDateISOTZ(
                  formDatasWaist.find(({ id }) => id === item.id).Date
                )}
                onChange={handleChange}
                id={item.id}
                name="Date"
              />
            </span>
            <span className="care-elements__edit-block care-elements__edit-block--double">
              <label>Waist circumference (cm): </label>
              <input
                type="text"
                value={
                  formDatasWaist.find(({ id }) => id === item.id)
                    .WaistCircumference
                }
                onChange={handleChange}
                id={item.id}
                name="Waist"
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

export default WaistHistoryEdit;
