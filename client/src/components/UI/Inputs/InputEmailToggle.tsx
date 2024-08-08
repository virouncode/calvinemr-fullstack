import React from "react";
type InputEmailToggleProps = {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id: string;
  editVisible: boolean;
  label?: string;
  placeholder?: string;
};

const InputEmailToggle = ({
  value,
  onChange,
  name,
  id,
  editVisible,
  label,
  placeholder,
}: InputEmailToggleProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      {editVisible ? (
        <input
          type="email"
          value={value}
          onChange={onChange}
          name={name}
          id={id}
          autoComplete="off"
          placeholder={placeholder}
        />
      ) : (
        <p>{value}</p>
      )}
    </>
  );
};

export default InputEmailToggle;
