import React from "react";

type GenericListProps = {
  list: { code: string; name: string }[];
  value: string;
  name?: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeHolder: string;
  noneOption?: boolean;
  id?: string;
  label?: string;
};

const GenericList = ({
  list,
  value,
  name,
  handleChange,
  placeHolder,
  noneOption = true,
  id,
  label,
}: GenericListProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        value={value}
        name={name}
        onChange={handleChange}
        id={id}
        style={{ color: value === "" ? "#a3a3a3" : "" }}
      >
        <option value="" disabled>
          {placeHolder}
        </option>
        {noneOption && <option value="">(None)</option>}
        {list.map((item) => (
          <option value={item.code} key={item.code}>
            {item.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default GenericList;
