import React from "react";
type InputProps = {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  label?: string;
  width?: number;
  placeholder?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
  className?: string;
  mt?: number;
  ref?: React.MutableRefObject<HTMLInputElement | null>;
};
const Input = ({
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
  mt = 0,
  ref,
}: InputProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="text"
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        autoComplete="off"
        style={{ width: width ? `${width}px` : "", marginTop: `${mt}px` }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        readOnly={readOnly}
        className={className}
        ref={ref}
      />
    </>
  );
};

export default Input;
