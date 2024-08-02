import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { ynIndicatorsimpleCT } from "../../../../../omdDatas/codesTables";
import {
    dateISOToTimestampTZ,
    nowTZTimestamp,
    timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import GenericList from "../../../../UI/Lists/GenericList";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";

const SmokingHistoryEdit = ({ datas, careElementPut, setEditVisible }) => {
  const { user } = useUserContext();
  const [formDatasSmokingStatus, setFormDatasSmokingStatus] = useState(
    datas?.SmokingStatus?.map((item, index) => {
      return { ...item, id: index };
    })
  );
  const [formDatasSmokingPacks, setFormDatasSmokingPacks] = useState(
    datas?.SmokingPacks?.map((item, index) => {
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
      case "SmokingStatus":
        setFormDatasSmokingStatus(
          formDatasSmokingStatus.map((item) => {
            return item.id === parseInt(id) ? { ...item, Status: value } : item;
          })
        );
        setFormDatasSmokingPacks(
          formDatasSmokingPacks.map((item) => {
            return item.id === parseInt(id)
              ? { ...item, PerDay: value === "N" ? "0" : "" }
              : item;
          })
        );
        break;
      case "SmokingPacks":
        setFormDatasSmokingPacks(
          formDatasSmokingPacks.map((item) => {
            return item.id === parseInt(id) ? { ...item, PerDay: value } : item;
          })
        );
        setFormDatasSmokingStatus(
          formDatasSmokingStatus.map((item) => {
            return item.id === parseInt(id)
              ? { ...item, Status: Number(value) ? "Y" : "N" }
              : item;
          })
        );
        break;
      case "Date":
        setFormDatasSmokingStatus(
          formDatasSmokingStatus.map((item) => {
            return item.id === parseInt(id)
              ? { ...item, Date: dateISOToTimestampTZ(value) }
              : item;
          })
        );
        setFormDatasSmokingPacks(
          formDatasSmokingPacks.map((item) => {
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
    if (formDatasSmokingPacks.some(({ PerDay, Date }) => !PerDay || !Date)) {
      setErrMsgPost(
        "Please fill Date and Packs Per Day fields (enter 0 if no smoking)"
      );
      return;
    }
    if (
      formDatasSmokingPacks.some(
        ({ PerDay }) => !PerDay.match(/^\d+([.,]\d{0,2})?$/)
      )
    ) {
      setErrMsgPost("Please enter a valid number for Packs Per Day");
      return;
    }
    const careElementToPut = {
      ...datas,
      SmokingStatus: formDatasSmokingStatus,
      SmokingPacks: formDatasSmokingPacks,
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
      <ul className="care-elements__edit-list">
        {formDatasSmokingStatus?.map((item) => (
          <li className="care-elements__edit-item" key={item.id}>
            <span className="care-elements__edit-block">
              <label>Date: </label>
              <input
                type="date"
                value={timestampToDateISOTZ(
                  formDatasSmokingStatus.find(({ id }) => id === item.id).Date
                )}
                onChange={handleChange}
                id={item.id}
                name="Date"
              />
            </span>
            <span className="care-elements__edit-block">
              <label>Smoking: </label>
              <GenericList
                list={ynIndicatorsimpleCT}
                name="SmokingStatus"
                handleChange={handleChange}
                value={
                  formDatasSmokingStatus.find(({ id }) => id === item.id).Status
                }
                noneOption={false}
                id={item.id}
              />
            </span>
            <span className="care-elements__edit-block">
              <label>Packs Per day: </label>
              <input
                type="text"
                value={
                  formDatasSmokingPacks.find(({ id }) => id === item.id).PerDay
                }
                onChange={handleChange}
                id={item.id}
                name="SmokingPacks"
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

export default SmokingHistoryEdit;
