import React from "react";

type ErrorParagraphProps = {
  errorMsg: string;
};

const ErrorParagraph = ({ errorMsg }: ErrorParagraphProps) => {
  return <p className="error-paragraph">{errorMsg}</p>;
};

export default ErrorParagraph;
