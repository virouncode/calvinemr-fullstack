import React from "react";
import { relations } from "../../../../../utils/relationships/relations";

type RelationshipListProps = {
  value: string;
  handleChange: (value: string, itemId: number) => void;
  itemId?: number;
};

const RelationshipList = ({
  value,
  handleChange,
  itemId = 0,
}: RelationshipListProps) => {
  return (
    // <DropdownList
    //   placeholder="Choose or type a relationship"
    //   value={value}
    //   onChange={(value) => handleChange(value, itemId)}
    //   data={relations}
    // />

    <select
      value={value}
      onChange={(e) => handleChange(e.target.value, itemId)}
    >
      {relations &&
        relations.map((relation) => (
          <option value={relation} key={relation}>
            {relation}
          </option>
        ))}
    </select>
  );
};

export default RelationshipList;
