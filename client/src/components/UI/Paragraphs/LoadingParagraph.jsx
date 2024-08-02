import { CircularProgress } from "@mui/material";


const LoadingParagraph = () => {
  return (
    <p className="loading-paragraph">
      Loading...
      <CircularProgress size="0.8rem" />
    </p>
  );
};

export default LoadingParagraph;
