import React from "react";

type CycleStatusSelectProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
};

const CycleStatusSelect = ({
  value,
  onChange,
  label,
}: CycleStatusSelectProps) => {
  return (
    <>
      {label && <label htmlFor="status">{label}</label>}
      <select value={value} onChange={onChange} id="status" name="status">
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </>
  );
};

export default CycleStatusSelect;
