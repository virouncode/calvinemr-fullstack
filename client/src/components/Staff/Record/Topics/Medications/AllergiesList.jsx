import ExclamationTriangleIcon from "../../../../UI/Icons/ExclamationTriangleIcon";

const AllergiesList = ({ allergies }) => {
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
