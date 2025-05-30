import React from "react";
type InputTextToggleProps = {
  value: string;
  name: string;
  editVisible: boolean;
  id?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  label?: string;
  placeholder?: string;
};
const InputTextToggle = ({
  value,
  onChange,
  onClick,
  name,
  id,
  editVisible,
  label,
  placeholder,
}: InputTextToggleProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      {editVisible ? (
        <input
          type="text"
          value={value}
          onChange={onChange}
          onClick={onClick}
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

export default InputTextToggle;
