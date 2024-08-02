import _ from "lodash";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import CycleNoteForm from "./CycleNoteForm";
const CycleNotes = ({ formDatas, setFormDatas, setErrMsg, errMsg }) => {
  const handleAdd = (e) => {
    setErrMsg("");
    e.preventDefault();
    setFormDatas({
      ...formDatas,
      notes: [
        ...formDatas.notes,
        {
          temp_id: _.uniqueId(),
          text: "",
          date: nowTZTimestamp(),
        },
      ],
    });
  };
  return (
    <fieldset
      className="cycles-form__events"
      style={{ border: errMsg && "solid 1px red" }}
    >
      <legend>EVENTS NOTES</legend>
      <button style={{ marginBottom: "10px" }} onClick={handleAdd}>
        Add
      </button>
      <div className="cycles-form__events-table-container">
        <table className="cycles-form__events-table">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Action</th>
              <th style={{ width: "10%" }}>Date</th>
              <th style={{ width: "80%" }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {formDatas.notes.length > 0 ? (
              formDatas.notes.map((item, index) => (
                <CycleNoteForm
                  key={item.temp_id + index}
                  item={item}
                  formDatas={formDatas}
                  setFormDatas={setFormDatas}
                  setErrMsg={setErrMsg}
                />
              ))
            ) : (
              <EmptyRow colSpan="3" text="No notes" />
            )}
          </tbody>
        </table>
      </div>
    </fieldset>
  );
};

export default CycleNotes;
