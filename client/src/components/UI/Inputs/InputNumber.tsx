import React from "react";

type InputNumberProps = {
  value: number | "";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id?: string;
  label?: string;
  width?: number;
  placeholder?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  className?: string;
  step?: string;
  min?: string;
};

const InputNumber = ({
  value,
  onChange,
  name,
  id,
  label,
  width,
  placeholder,
  autoFocus = false,
  readOnly = false,
  className = "",
  step = "1",
  min = "0",
}: InputNumberProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="number"
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        autoComplete="off"
        style={{ width: width ? `${width}px` : "" }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        readOnly={readOnly}
        className={className}
        step={step}
        min={min}
      />
    </>
  );
};

export default InputNumber;
