import React from "react";
import { CycleNoteType } from "../../../../../types/api";
import CyclePrintNote from "./CyclePrintNote";

type CyclePrintNotesProps = {
  notes: CycleNoteType[];
};

const CyclePrintNotes = ({ notes }: CyclePrintNotesProps) => {
  return (
    <div className="cycle-print__notes">
      <div className="cycle-print__notes-title">Notes</div>
      {notes.length > 0
        ? notes.map((note, index) => (
            <CyclePrintNote key={`cycle-note-${index}`} note={note} />
          ))
        : "No notes"}
    </div>
  );
};

export default CyclePrintNotes;
