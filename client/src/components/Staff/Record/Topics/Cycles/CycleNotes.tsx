import _ from "lodash";
import React from "react";
import { CycleType } from "../../../../../types/api";
import { todayTZTimestamp } from "../../../../../utils/dates/formatDates";
import Button from "../../../../UI/Buttons/Button";
import EmptyRow from "../../../../UI/Tables/EmptyRow";
import CycleNoteForm from "./CycleNoteForm";

type CycleNotesProps = {
  formDatas: Partial<CycleType>;
  setFormDatas: React.Dispatch<React.SetStateAction<Partial<CycleType>>>;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
  errMsg: string;
};
const CycleNotes = ({
  formDatas,
  setFormDatas,
  setErrMsg,
  errMsg,
}: CycleNotesProps) => {
  const handleAdd = () => {
    setErrMsg("");
    setFormDatas({
      ...formDatas,
      notes: [
        ...(formDatas.notes ?? []),
        {
          temp_id: _.uniqueId(),
          text: "",
          date: todayTZTimestamp(),
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
      <div style={{ marginBottom: "10px" }}>
        <Button onClick={handleAdd} label="Add" />
      </div>
      <div
        className="cycles-form__events-table-container"
        style={{ height: "200px" }}
      >
        <table className="cycles-form__events-table">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Action</th>
              <th style={{ width: "10%" }}>Date</th>
              <th style={{ width: "80%" }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {(formDatas.notes?.length ?? 0) > 0 ? (
              formDatas.notes
                ?.sort(
                  (a, b) => ((a.date as number) - (b.date as number)) as number
                )
                .map((item, index) => (
                  <CycleNoteForm
                    key={"notes" + index}
                    item={item}
                    formDatas={formDatas}
                    setFormDatas={setFormDatas}
                    setErrMsg={setErrMsg}
                    index={index}
                  />
                ))
            ) : (
              <EmptyRow colSpan={3} text="No notes" />
            )}
          </tbody>
        </table>
      </div>
    </fieldset>
  );
};

export default CycleNotes;
