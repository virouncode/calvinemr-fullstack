import React from "react";
import { Combobox } from "react-widgets";

const etiology = [
  "Unexplained",
  "Ovulation",
  "Tubal/Peritoneal",
  "Male",
  "Uterine",
  "Other",
];

type EtiologyListProps = {
  handleChange: (value: string) => void;
  value: string;
};

const EtiologyList = ({ handleChange, value }: EtiologyListProps) => {
  return (
    <Combobox
      placeholder="Choose or type..."
      value={value}
      onChange={(value) => handleChange(value)}
      data={etiology}
    />
  );
};

export default EtiologyList;
