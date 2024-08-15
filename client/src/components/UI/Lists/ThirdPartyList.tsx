import React from "react";
import { Combobox } from "react-widgets";
type ThirdPartyListProps = {
  handleChange: (value: string) => void;
  value: string;
  label?: string;
};
const thirdParty = [
  "Oocyte donation",
  "Oocyte donation + Sperm donation",
  "Sperm donation",
  "Embryo donation",
  "Surrogacy",
];

const ThirdPartyList = ({
  handleChange,
  value,
  label,
}: ThirdPartyListProps) => {
  return (
    <>
      {label && <label htmlFor="third-party">{label}</label>}
      <Combobox
        placeholder="Choose or type..."
        value={value}
        onChange={(value) => handleChange(value)}
        data={thirdParty}
      />
    </>
  );
};

export default ThirdPartyList;
