import React from "react";
import { EformBlankType } from "../../../../../types/api";

type EformsListProps = {
  handleFormChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  formSelectedId: number;
  eformsBlank: EformBlankType[];
};

const EformsList = ({
  handleFormChange,
  formSelectedId,
  eformsBlank,
}: EformsListProps) => {
  return (
    <select
      onChange={handleFormChange}
      style={{ marginLeft: "10px" }}
      value={formSelectedId}
    >
      <option value="" disabled>
        Choose an e-form...
      </option>
      {eformsBlank.map((eform) => (
        <option key={eform.id} value={eform.id}>
          {eform.name}
        </option>
      ))}
    </select>
  );
};

export default EformsList;
