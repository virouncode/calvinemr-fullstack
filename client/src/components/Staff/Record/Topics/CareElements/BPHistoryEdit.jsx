import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
    dateISOToTimestampTZ,
    nowTZTimestamp,
    timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";

const BPHistoryEdit = ({ datas, careElementPut, setEditVisible }) => {
  const { user } = useUserContext();
  const [formDatasBP, setFormDatasBP] = useState(
    datas?.BloodPressure.map((item, index) => {
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
      case "Systolic":
        setFormDatasBP(
          formDatasBP.map((item) => {
            return item.id === parseInt(id)
              ? { ...item, SystolicBP: value }
              : item;
          })
        );
        break;
      case "Diastolic":
        setFormDatasBP(
          formDatasBP.map((item) => {
            return item.id === parseInt(id)
              ? { ...item, DiastolicBP: value }
              : item;
          })
        );
        break;
      case "Date":
        setFormDatasBP(
          formDatasBP.map((item) => {
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
      formDatasBP.some(
        ({ SystolicBP, DiastolicBP, Date }) =>
          !SystolicBP || !DiastolicBP || !Date
      )
    ) {
      setErrMsgPost("Please fill all fields");
      return;
    }
    if (
      formDatasBP.some(
        ({ SystolicBP, DiastolicBP }) =>
          !SystolicBP.match(/^\d+([.,]\d{0,2})?$/) ||
          !DiastolicBP.match(/^\d+([.,]\d{0,2})?$/)
      )
    ) {
      setErrMsgPost(
        "Please enter a valid number for Systolic and Diastolic Blood Pressure"
      );
      return;
    }
    const careElementToPut = {
      ...datas,
      BloodPressure: formDatasBP,
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
        {formDatasBP.map((item) => (
          <li className="care-elements__edit-item" key={item.id}>
            <span className="care-elements__edit-block">
              <label>Date: </label>
              <input
                type="date"
                value={timestampToDateISOTZ(
                  formDatasBP.find(({ id }) => id === item.id).Date
                )}
                onChange={handleChange}
                id={item.id}
                name="Date"
              />
            </span>
            <span className="care-elements__edit-block">
              <label>Systolic (mmHg): </label>
              <input
                type="text"
                value={formDatasBP.find(({ id }) => id === item.id).SystolicBP}
                onChange={handleChange}
                id={item.id}
                name="Systolic"
              />
            </span>
            <span className="care-elements__edit-block">
              <label>Diastolic (mmHg): </label>
              <input
                type="text"
                value={formDatasBP.find(({ id }) => id === item.id).DiastolicBP}
                onChange={handleChange}
                id={item.id}
                name="Diastolic"
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

export default BPHistoryEdit;
