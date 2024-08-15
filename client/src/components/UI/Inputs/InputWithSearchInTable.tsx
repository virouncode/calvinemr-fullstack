import React from "react";
import MagnifyingGlassIcon from "../Icons/MagnifyingGlassIcon";
type InputWithSearchInTableProps = {
  id?: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  label?: string;
  readOnly?: boolean;
  logo?: boolean;
};

const InputWithSearchInTable = ({
  id,
  name,
  value,
  onChange,
  onClick,
  label,
  readOnly,
  logo = true,
}: InputWithSearchInTableProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="text"
        value={value}
        name={name}
        onChange={onChange}
        readOnly={readOnly}
        id={id}
      />
      {logo && <MagnifyingGlassIcon right={12} top={17} onClick={onClick} />}
    </>
  );
};

export default InputWithSearchInTable;
