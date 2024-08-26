import React from "react";
type InputEmailToggleProps = {
  value: string;
  name: string;
  id: string;
  editVisible: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
