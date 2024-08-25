import React from "react";
type EmptyRowProps = {
  colSpan: number;
  errorMsg: string;
};

const EmptyRow = ({ colSpan, errorMsg }: EmptyRowProps) => {
  return (
    <tr className="empty-row">
      <td colSpan={colSpan} style={{ textAlign: "left" }}>
        {errorMsg}
      </td>
    </tr>
  );
};

export default EmptyRow;
