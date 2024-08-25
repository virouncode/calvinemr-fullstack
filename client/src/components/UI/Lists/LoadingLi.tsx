import React from "react";
import CircularProgressSmall from "../Progress/CircularProgressSmall";

type LoadingLiProps = {
  paddingLateral?: number;
};

const LoadingLi = ({ paddingLateral = 0 }: LoadingLiProps) => {
  return (
    <li
      className="loading-li"
      style={{ padding: `0 ${paddingLateral}px`, fontWeight: "bold" }}
    >
      Loading...
      <CircularProgressSmall />
    </li>
  );
};

export default LoadingLi;
