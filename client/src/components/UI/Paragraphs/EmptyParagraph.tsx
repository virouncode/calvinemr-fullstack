import React from "react";

type EmptyParagraphProps = {
  text: string;
};

const EmptyParagraph = ({ text }: EmptyParagraphProps) => {
  return <p className="empty-paragraph">{text}</p>;
};

export default EmptyParagraph;
