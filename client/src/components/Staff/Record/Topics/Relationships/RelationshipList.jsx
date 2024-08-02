
import { Combobox } from "react-widgets";
import { relations } from "../../../../../utils/relationships/relations";

const RelationshipList = ({ value, handleChange, itemId = 0 }) => {
  return (
    <Combobox
      placeholder="Choose or type a relationship"
      value={value}
      onChange={(value) => handleChange(value, itemId)}
      data={relations}
    />
  );
};

export default RelationshipList;
