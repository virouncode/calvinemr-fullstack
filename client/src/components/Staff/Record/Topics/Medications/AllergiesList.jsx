const AllergiesList = ({ allergies }) => {
  return (
    <>
      <i
        className="fa-solid fa-triangle-exclamation"
        style={{ color: "#ff0000" }}
      />{" "}
      Patient Allergies :{" "}
      {allergies && allergies.length > 0
        ? allergies
            .map(({ OffendingAgentDescription }) => OffendingAgentDescription)
            .join(", ")
        : "No allergies"}
    </>
  );
};

export default AllergiesList;
