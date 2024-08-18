import React from "react";
type InputTelProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  label?: string;
  width?: number;
  placeholder?: string;
};

const InputTel = ({
  value,
  onChange,
  name,
  id,
  label,
  width,
  placeholder,
}: InputTelProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="tel"
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        autoComplete="off"
        style={{ width: width ? `${width}px` : "" }}
        placeholder={placeholder}
      />
    </>
  );
};

export default InputTel;
