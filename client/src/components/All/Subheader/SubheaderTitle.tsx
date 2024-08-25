import React from "react";
type SubheaderTitleProps = {
  title: string;
};
const SubheaderTitle = ({ title }: SubheaderTitleProps) => {
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
