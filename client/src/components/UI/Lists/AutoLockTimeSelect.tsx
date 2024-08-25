import React from "react";

type AutoLockTimeSelectProps = {
  autolockTime: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
};

const AutoLockTimeSelect = ({
  autolockTime,
  onChange,
  label,
}: AutoLockTimeSelectProps) => {
  return (
    <>
      {label && <label style={{ marginRight: "10px" }}>{label}</label>}
      <select value={autolockTime} onChange={onChange}>
        <option value="1">1 min</option>
        <option value="5">5 min</option>
        <option value="10">10 min</option>
        <option value="15">15 min</option>
        <option value="30">30 min</option>
        <option value="60">1 hour</option>
      </select>
    </>
  );
};

export default AutoLockTimeSelect;
