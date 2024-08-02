
import { Combobox } from "react-widgets";

const thirdParty = [
  "Oocyte donation",
  "Oocyte donation + Sperm donation",
  "Sperm donation",
  "Embryo donation",
  "Surrogacy",
];

const ThirdPartyList = ({ handleChange, value }) => {
  return (
    <Combobox
      placeholder="Choose or type..."
      value={value}
      onChange={(value) => handleChange(value)}
      data={thirdParty}
    />
  );
};

export default ThirdPartyList;
