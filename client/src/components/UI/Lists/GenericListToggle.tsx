import React from "react";
import { toCodeTableName } from "../../../omdDatas/codesTables";

type GenericListToggleProps = {
  list: { name: string; code: string }[];
  value: string;
  name: string;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeHolder?: string;
  noneOption?: boolean;
  id?: string;
  label?: string;
  editVisible: boolean;
};

const GenericListToggle = ({
  list,
  value,
  name,
  handleChange,
  placeHolder,
  noneOption = true,
  id,
  label,
  editVisible,
}: GenericListToggleProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      {editVisible ? (
        <select value={value} name={name} onChange={handleChange} id={id}>
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
      ) : (
        <p>{toCodeTableName(list, value)}</p>
      )}
    </>
  );
};

export default GenericListToggle;
