import { CircularProgress } from "@mui/material";
import React from "react";

const LoadingParagraph = () => {
  return (
    <p className="loading-paragraph">
      Loading...
      <CircularProgress size="0.85rem" />
    </p>
  );
};

export default LoadingParagraph;
