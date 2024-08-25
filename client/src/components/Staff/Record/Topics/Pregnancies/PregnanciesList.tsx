import React from "react";
import { Combobox } from "react-widgets/cjs";

const pregnancyEvents = [
  "Abortion - 1st trimester",
  "Abortion - 2nd trimester",
  "Abortion - 3rd trimester",
  "Chemical pregnancy",
  "Miscarriage - 1st trimester",
  "Second trimester fetal loss",
  "Third trimester fetal loss",
  "Intra-uterine fetal death",
  "Ectopic pregnancy",
  "Vaginal birth",
  "Vaginal birth - forceps",
  "Vaginal birth - vacuum",
  "Cesarean section",
];

type PregnanciesListProps = {
  value: string;
  handleChange: (value: string) => void;
};

const PregnanciesList = ({ value, handleChange }: PregnanciesListProps) => {
  return (
    <Combobox
      placeholder="Choose or type an event..."
      value={pregnancyEvents.find((event) => event === value) || value}
      onChange={(value) => handleChange(value)}
      data={pregnancyEvents}
    />
  );
};

export default PregnanciesList;
