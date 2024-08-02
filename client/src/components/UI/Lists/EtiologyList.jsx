
import { Combobox } from "react-widgets";

const etiology = [
  "Unexplained",
  "Ovulation",
  "Tubal/Peritoneal",
  "Male",
  "Uterine",
  "Other",
];

const EtiologyList = ({ handleChange, value }) => {
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
