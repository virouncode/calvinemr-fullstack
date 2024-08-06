const ClinicalNotesNavigation = ({ handleGoToTop, handleGoToEnd }) => {
  return (
    <>
      <i
        className="fa-solid fa-angles-up"
        style={{
          marginLeft: "5px",
          marginRight: "2px",
          cursor: "pointer",
        }}
        onClick={handleGoToTop}
      />
      <i
        className="fa-solid fa-angles-down"
        style={{
          marginRight: "2px",
          cursor: "pointer",
        }}
        onClick={handleGoToEnd}
      />
    </>
  );
};

export default ClinicalNotesNavigation;
