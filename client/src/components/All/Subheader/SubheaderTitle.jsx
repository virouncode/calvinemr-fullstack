const SubheaderTitle = ({ title }) => {
  return (
    <h2 className="subheader-section__title">
      {title}{" "}
      {title === "Calvin AI Chat" && (
        <sup style={{ fontSize: "0.5rem" }}>Powered by ChatGPT</sup>
      )}
    </h2>
  );
};

export default SubheaderTitle;
