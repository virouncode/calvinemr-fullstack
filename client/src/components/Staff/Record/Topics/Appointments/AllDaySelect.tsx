import React from "react";

type AllDaySelectProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
};
const AllDaySelect = ({ value, onChange, name }: AllDaySelectProps) => {
  return (
    <select name={name} value={value} onChange={onChange}>
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
  );
};

export default AllDaySelect;
