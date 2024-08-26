import React from "react";

type CheckboxProps = {
  checked: boolean;
  id?: string;
  name?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
  disabled?: boolean;
  label?: string;
  labelSide?: "left" | "right";
  mr?: number;
  className?: string;
  accentColor?: string;
};

const Checkbox = ({
  id,
  name,
  onChange,
  onClick,
  checked,
  disabled,
  label,
  labelSide = "right",
  mr = 5,
  className = "",
  accentColor = "",
}: CheckboxProps) => {
  return (
    <>
      {label && labelSide === "left" && <label htmlFor={id}>{label}</label>}
      <input
        type="checkbox"
        onChange={onChange}
        onClick={onClick}
        checked={checked}
        disabled={disabled}
        style={{ marginRight: `${mr}px`, accentColor: accentColor }}
        id={id}
        name={name}
        className={className}
      />
      {label && labelSide === "right" && <label htmlFor={id}>{label}</label>}
    </>
  );
};

export default Checkbox;
