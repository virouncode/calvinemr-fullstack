import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import {
  bodyMassIndex,
  kgToLbs,
  lbsToKg,
} from "../../../../../utils/measurements/measurements";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";

const WeightLbsHistoryEdit = ({ datas, careElementPut, setEditVisible }) => {
  const { user } = useUserContext();
  const [formDatasWeight, setFormDatasWeight] = useState(
    datas?.Weight?.map((item, index) => {
      return { ...item, id: index, Weight: kgToLbs(item.Weight) };
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
    let lastHeight = 0;
    switch (name) {
      case "Weight":
        lastHeight =
          datas.Height.filter(
            ({ Date }) =>
              Date <=
              formDatasWeight.find((item) => item.id === parseInt(id)).Date
          )
            .sort((a, b) => a.Date - b.Date)
            ?.at(-1)?.Height || 0;

        setFormDatasWeight(
          formDatasWeight.map((item) => {
            return item.id === parseInt(id) ? { ...item, Weight: value } : item;
          })
        );
        setFormDatasBodyMassIndex(
          formDatasBodyMassIndex.map((item) => {
            return item.id === parseInt(id)
              ? { ...item, BMI: bodyMassIndex(lastHeight, lbsToKg(value)) }
              : item;
          })
        );
        setFormDatasBodySurfaceArea(
          formDatasBodySurfaceArea.map((item) => {
            return item.id === parseInt(id)
              ? { ...item, BSA: bodyMassIndex(lastHeight, lbsToKg(value)) }
              : item;
          })
        );
        break;
      case "Date":
        lastHeight =
          datas.Height.filter(({ Date }) => Date <= dateISOToTimestampTZ(value))
            .sort((a, b) => a.Date - b.Date)
            ?.at(-1)?.Height || 0;

        setFormDatasWeight(
          formDatasWeight.map((item) => {
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
                    lastHeight,
                    lbsToKg(
                      formDatasWeight.find(({ id }) => id === parseInt(id))
                        .Weight
                    )
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
                    lastHeight,
                    lbsToKg(
                      formDatasWeight.find(({ id }) => id === parseInt(id))
                        .Weight
                    )
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
    if (formDatasWeight.some(({ Weight, Date }) => !Weight || !Date)) {
      setErrMsgPost("Please fill both Weight and Date fields");
      return;
    }
    if (
      formDatasWeight.some(({ Weight }) => !Weight.match(/^\d+([.,]\d{0,2})?$/))
    ) {
      setErrMsgPost("Please enter a valid number for Weight");
      return;
    }
    const careElementToPut = {
      ...datas,
      Weight: formDatasWeight.map((item) => {
        return { ...item, Weight: lbsToKg(item.Weight) };
      }),
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
        {formDatasWeight.map((item) => (
          <li className="care-elements__edit-item" key={item.id}>
            <span className="care-elements__edit-block care-elements__edit-block--double">
              <label>Date: </label>
              <input
                type="date"
                value={timestampToDateISOTZ(
                  formDatasWeight.find(({ id }) => id === item.id).Date
                )}
                onChange={handleChange}
                id={item.id}
                name="Date"
              />
            </span>
            <span className="care-elements__edit-block care-elements__edit-block--double">
              <label>Weight (lbs): </label>
              <input
                type="text"
                value={formDatasWeight.find(({ id }) => id === item.id).Weight}
                onChange={handleChange}
                id={item.id}
                name="Weight"
              />
            </span>
          </li>
        ))}
      </ul>
      <div className="care-elements__edit-btns">
        <SaveButton onClick={handleSubmit} />
        <CloseButton onClick={handleClose} />
      </div>
    </div>
  );
};

export default WeightLbsHistoryEdit;
