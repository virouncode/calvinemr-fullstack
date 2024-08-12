import React from "react";
import MagnifyingGlassIcon from "../Icons/MagnifyingGlassIcon";

type InputWithSearchProps = {
  id: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  label?: string;
  readOnly?: boolean;
  logo?: boolean;
  width?: number;
};

const InputWithSearch = ({
  id,
  name,
  value,
  onChange,
  onClick,
  label,
  readOnly,
  logo = true,
  width,
}: InputWithSearchProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="text"
        value={value}
        name={name}
        onChange={onChange}
        readOnly={readOnly}
        id="provider_ohip_billing_nbr"
        style={{ width: width ? `${width}px` : "" }}
      />
      {logo && <MagnifyingGlassIcon right={5} top={5} onClick={onClick} />}
    </>
  );
};

export default InputWithSearch;
