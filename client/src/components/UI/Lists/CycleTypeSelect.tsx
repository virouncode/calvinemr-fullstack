import React from "react";
import { cycleTypes } from "./CycleTypeList";
type CycleTypeSelectProps = {
  handleCycleTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  label?: string;
  all?: boolean;
};
const CycleTypeSelect = ({
  handleCycleTypeChange,
  value,
  label,
  all = false,
}: CycleTypeSelectProps) => {
  return (
    <>
      {label && (
        <label htmlFor="cycle-type-select" style={{ fontWeight: "bold" }}>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={handleCycleTypeChange}
        id="cycle-type-select"
      >
        {all && <option value="all">All</option>}
        <option value="0" disabled>
          Choose a cycle type...
        </option>
        {cycleTypes.map((type) => (
          <option value={type} key={type}>
            {type}
          </option>
        ))}
      </select>
    </>
  );
};

export default CycleTypeSelect;
