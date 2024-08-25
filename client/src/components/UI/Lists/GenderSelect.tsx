import React from "react";

type GenderSelectProps = {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
};

const GenderSelect = ({
  id,
  name,
  value,
  onChange,
  label,
}: GenderSelectProps) => {
  return (
    <>
      {label && <label htmlFor="gender">{label} </label>}
      <select value={value} onChange={onChange} name={name} id={id}>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </>
  );
};

export default GenderSelect;
