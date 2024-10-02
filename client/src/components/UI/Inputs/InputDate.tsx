import React from "react";
type InputDateProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  label?: string;
  width?: number;
  disabled?: boolean;
  min?: string;
  max?: string;
};

const InputDate = ({
  value,
  onChange,
  name,
  id,
  label,
  width,
  disabled = false,
  min = "1800-01-01",
  max = "3000-01-01",
}: InputDateProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="date"
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        style={{ width: width ? `${width}px` : "" }}
        disabled={disabled}
        min={min}
        max={max}
        autoComplete="off"
        placeholder="Select a date"
        defaultValue=""
      />
    </>
  );
};

export default InputDate;
