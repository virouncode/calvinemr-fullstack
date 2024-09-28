import React from "react";
import MagnifyingGlassIcon from "../Icons/MagnifyingGlassIcon";
type InputWithSearchInTableProps = {
  name: string;
  value: string;
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  logo?: boolean;
};

const InputWithSearchInTable = ({
  name,
  value,
  onChange,
  onClick,
  readOnly,
  logo = true,
}: InputWithSearchInTableProps) => {
  return (
    <>
      <input
        type="text"
        value={value}
        name={name}
        onChange={onChange}
        readOnly={readOnly}
      />
      {logo && <MagnifyingGlassIcon right={12} top={19} onClick={onClick} />}
    </>
  );
};

export default InputWithSearchInTable;
