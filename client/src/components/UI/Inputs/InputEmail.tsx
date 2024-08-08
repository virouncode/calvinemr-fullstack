import React from "react";
type InputEmailProps = {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  label?: string;
  width?: number;
  placeholder?: string;
  autoFocus?: boolean;
};

const InputEmail = ({
  value,
  onChange,
  name,
  id,
  label,
  width,
  placeholder,
  autoFocus = false,
}: InputEmailProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="email"
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        autoComplete="off"
        style={{ width: width ? `${width}px` : "" }}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </>
  );
};

export default InputEmail;
