const EventFormNotes = ({ formDatas, handleNotesChange }) => {
  return (
    <div className="event-form__row">
      <div className="event-form__item">
        <label htmlFor="notes">Notes</label>
        <textarea
          value={formDatas.AppointmentNotes}
          onChange={handleNotesChange}
          name="AppointmentNotes"
          id="notes"
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default EventFormNotes;
