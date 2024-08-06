import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import Button from "../../../../UI/Buttons/Button";
import InputDate from "../../../../UI/Inputs/InputDate";

const CycleNoteForm = ({ formDatas, setFormDatas, item, setErrMsg }) => {
  const handleRemove = () => {
    setErrMsg("");
    setFormDatas({
      ...formDatas,
      notes: formDatas.notes.filter((note) => note.temp_id !== item.temp_id),
    });
  };
  const handleChange = (e) => {
    setErrMsg("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "date")
      value = value === "" ? null : dateISOToTimestampTZ(value);
    setFormDatas({
      ...formDatas,
      notes: formDatas.notes.map((note) => {
        return note.temp_id === item.temp_id
          ? { ...note, [name]: value }
          : note;
      }),
    });
  };
  return (
    <tr className="cycles-form__events-item">
      <td style={{ width: "10%" }}>
        <Button onClick={handleRemove} label="Remove" />
      </td>
      <td style={{ width: "10%" }}>
        <InputDate
          name="date"
          value={timestampToDateISOTZ(item.date)}
          onChange={handleChange}
          width={110}
        />
      </td>
      <td style={{ width: "80%" }}>
        <textarea
          name="text"
          value={item.text}
          onChange={handleChange}
          autoComplete="off"
          style={{ width: "100%", whiteSpace: "pre-wrap" }}
          rows={2}
        />
      </td>
    </tr>
  );
};

export default CycleNoteForm;
