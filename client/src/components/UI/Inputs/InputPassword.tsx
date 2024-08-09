import React from "react";

type InputPasswordProps = {
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  label?: string;
  width?: number;
  placeholder?: string;
  autoFocus?: boolean;
};

const InputPassword = ({
  value,
  onChange,
  name,
  id,
  label,
  width,
  placeholder,
  autoFocus = false,
}: InputPasswordProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="password"
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

export default InputPassword;
