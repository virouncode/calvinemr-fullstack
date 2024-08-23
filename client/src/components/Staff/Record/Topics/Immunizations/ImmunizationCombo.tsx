import React from "react";
import Combobox from "react-widgets/Combobox";
import { CodeTableType } from "../../../../../types/app";

type ImmunizationComboProps = {
  list: CodeTableType[];
  value: string;
  handleChange: (value: string) => void;
  placeHolder?: string;
};

const ImmunizationCombo = ({
  list,
  value,
  handleChange,
  placeHolder,
}: ImmunizationComboProps) => {
  return (
    <Combobox
      placeholder={placeHolder || "Choose or type..."}
      value={value}
      onChange={(value) => handleChange(value)}
      data={list.map((item) => item.code + " (" + item.name + " )")}
    />
  );
};

export default ImmunizationCombo;
