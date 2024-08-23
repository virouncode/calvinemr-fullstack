import React from "react";
import { Combobox } from "react-widgets";
import "react-widgets/scss/styles.scss";
import { relatives } from "../../../../../utils/relationships/relatives";

type RelativesListProps = {
  value: string;
  handleChange: (value: string) => void;
};

const RelativesList = ({ value, handleChange }: RelativesListProps) => {
  return (
    <Combobox
      placeholder="Choose a relative"
      value={value}
      onChange={handleChange}
      data={relatives}
    />
  );
};

export default RelativesList;
