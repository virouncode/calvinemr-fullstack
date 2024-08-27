import React from "react";
import { CycleNoteType } from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";

type CyclePrintNoteProps = {
  note: CycleNoteType;
};

const CyclePrintNote = ({ note }: CyclePrintNoteProps) => {
  return (
    <div className="cycle-print__notes-content">
      <div className="cycle-print__notes-item">
        <label>Date: </label>
        <span>{timestampToDateISOTZ(note.date)}</span>
      </div>
      <div className="cycle-print__notes-item">
        <label>Notes: </label>
        <span>{note.text}</span>
      </div>
    </div>
  );
};

export default CyclePrintNote;
