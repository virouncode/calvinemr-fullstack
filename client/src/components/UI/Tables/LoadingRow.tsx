import React from "react";
import CircularProgressSmall from "../Progress/CircularProgressSmall";

type LoadingRowProps = {
  colSpan: number;
};

const LoadingRow = ({ colSpan }: LoadingRowProps) => {
  return (
    <tr className="loading-row">
      <td colSpan={colSpan} style={{ textAlign: "left" }}>
        Loading...
        <CircularProgressSmall />
      </td>
    </tr>
  );
};

export default LoadingRow;
