
import Combobox from "react-widgets/Combobox";

const ImmunizationCombo = ({ list, value, handleChange, placeHolder }) => {
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
