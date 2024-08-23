import React from "react";
import { AllergyType } from "../../../../../types/api";
import ExclamationTriangleIcon from "../../../../UI/Icons/ExclamationTriangleIcon";

type AllergiesListProps = {
  allergies: AllergyType[];
};

const AllergiesList = ({ allergies }: AllergiesListProps) => {
  return (
    <>
      <ExclamationTriangleIcon /> Patient Allergies :{" "}
      {allergies && allergies.length > 0
        ? allergies
            .map(({ OffendingAgentDescription }) => OffendingAgentDescription)
            .join(", ")
        : "No allergies"}
    </>
  );
};

export default AllergiesList;
