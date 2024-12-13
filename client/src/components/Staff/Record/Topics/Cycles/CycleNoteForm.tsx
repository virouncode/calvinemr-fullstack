import React from "react";
import { CycleNoteType, CycleType } from "../../../../../types/api";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import Button from "../../../../UI/Buttons/Button";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import InputDate from "../../../../UI/Inputs/InputDate";

type CycleNoteFormProps = {
  formDatas: Partial<CycleType>;
  setFormDatas: React.Dispatch<React.SetStateAction<Partial<CycleType>>>;
  item: CycleNoteType;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
  index: number;
};

const CycleNoteForm = ({
  formDatas,
  setFormDatas,
  item,
  setErrMsg,
  index,
}: CycleNoteFormProps) => {
  const handleRemove = async () => {
    setErrMsg("");
    if (
      await confirmAlert({
        content: "Do you really want to remove this event note ?",
      })
    ) {
      setFormDatas({
        ...formDatas,
        notes: formDatas.notes?.filter((note) => note.temp_id !== item.temp_id),
      });
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setErrMsg("");
    const name = e.target.name;
    let value: string | number | null = e.target.value;
    if (name === "date")
      value = value === "" ? null : dateISOToTimestampTZ(value);
    setFormDatas({
      ...formDatas,
      notes: formDatas.notes?.map((note, noteIndex) => {
        return noteIndex === index ? { ...note, [name]: value } : note;
      }),
    });
  };
  return (
    <tr className="cycles-form__events-item">
      <td
        style={{ width: "10%" }}
        className="cycles-form__events-item-btn-container"
      >
        <Button onClick={handleRemove} label="Remove" />
      </td>
      <td style={{ width: "10%" }}>
        <InputDate
          name="date"
          value={timestampToDateISOTZ(item.date)}
          onChange={handleChange}
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
