import React from "react";

type RadioProps = {
  id?: string;
  name?: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
};
const Radio = ({ id, name, value, checked, onChange, label }: RadioProps) => {
  return (
    <>
      <input
        type="radio"
        value={value}
        name={name}
        checked={checked}
        onChange={onChange}
        id={id}
      />
      {label && <label htmlFor={id}>{label}</label>}
    </>
  );
};

export default Radio;
