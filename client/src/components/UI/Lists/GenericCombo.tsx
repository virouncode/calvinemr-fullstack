import React from "react";
import Combobox from "react-widgets/Combobox";

type GenericComboProps = {
  list: { name: string; code: string }[];
  value: string;
  handleChange: (value: string) => void;
  placeHolder?: string;
  label?: string;
};

const GenericCombo = ({
  list,
  value,
  handleChange,
  placeHolder,
  label,
}: GenericComboProps) => {
  return (
    <>
      {label && <label>{label}</label>}
      <Combobox
        placeholder={placeHolder || "Choose or type..."}
        value={value}
        onChange={(value) => handleChange(value)}
        data={list.map(({ name }) => name)}
      />
    </>
  );
};

export default GenericCombo;
