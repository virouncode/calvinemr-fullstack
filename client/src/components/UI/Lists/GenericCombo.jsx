
import Combobox from "react-widgets/Combobox";

const GenericCombo = ({ list, value, handleChange, placeHolder }) => {
  return (
    <Combobox
      placeholder={placeHolder || "Choose or type..."}
      value={value}
      onChange={(value) => handleChange(value)}
      data={list.map(({ name }) => name)}
    />
  );
};

export default GenericCombo;
