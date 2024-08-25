import React from "react";
type RecurrenceSelectProps = {
  value: string;
  handleRecurrenceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: boolean;
};
const RecurrenceSelect = ({
  value,
  handleRecurrenceChange,
  label = true,
}: RecurrenceSelectProps) => {
  return (
    <>
      {label && <label htmlFor="recurrence">Recurrence</label>}
      <select value={value} onChange={handleRecurrenceChange} id="recurrence">
        <option value="Once">Once</option>
        <option value="Every day">Every day</option>
        <option value="Every week">Every week</option>
        <option value="Every month">Every month</option>
        <option value="Every year">Every year</option>
      </select>
    </>
  );
};

export default RecurrenceSelect;
