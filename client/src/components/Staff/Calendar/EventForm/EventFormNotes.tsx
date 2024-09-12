import React from "react";
import { AppointmentType } from "../../../../types/api";

type EventFormNotesProps = {
  formDatas: AppointmentType;
  handleNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const EventFormNotes = ({
  formDatas,
  handleNotesChange,
}: EventFormNotesProps) => {
  return (
    <div className="event-form__notes">
      <label htmlFor="notes">Notes</label>
      <textarea
        value={formDatas.AppointmentNotes}
        onChange={handleNotesChange}
        name="AppointmentNotes"
        id="notes"
        autoComplete="off"
      />
    </div>
  );
};

export default EventFormNotes;
