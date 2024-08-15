import React from "react";

type InputDateToggleProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  id: string;
  label?: string;
  width?: number;
  disabled?: boolean;
  editVisible?: boolean;
  min?: string;
  max?: string;
};

const InputDateToggle = ({
  value,
  onChange,
  name,
  id,
  label,
  width,
  disabled = false,
  editVisible,
  min = "1800-01-01",
  max = "3000-01-01",
}: InputDateToggleProps) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      {editVisible ? (
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
        />
      ) : (
        <p>{value}</p>
      )}
    </>
  );
};

export default InputDateToggle;
