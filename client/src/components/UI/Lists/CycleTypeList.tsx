import React from "react";
import { Combobox } from "react-widgets";
export const cycleTypes = [
  "Natural/Investigative",
  "IC + Ovulation induction",
  "IUI + Ovulation induction",
  "IUI Natural cycle",
  "IVF antagonist",
  "IVF down regulation",
  "IVF flare up",
  "IVF sandwich",
  "IVF duostim",
  "FET natural cycle, no trigger",
  "FET natural cycle + trigger",
  "FET estrace + progesterone",
  "FET down regulation",
  "Oocyte thaw (own oocytes)",
  "Oocyte thaw (donor oocytes)",
  "Oocyte cryopreservation",
  "Split Fertilization - Oocyte cryopreservation",
] as const;

type CycleTypeListProps = {
  handleChange: (value: string) => void;
  value: string;
  label?: string;
};

const CycleTypeList = ({ handleChange, value, label }: CycleTypeListProps) => {
  return (
    <>
      {label && <label htmlFor="cycle_type">{label}</label>}
      <Combobox
        placeholder="Choose or type..."
        value={value}
        onChange={(value) => handleChange(value)}
        data={cycleTypes}
      />
    </>
  );
};

export default CycleTypeList;
