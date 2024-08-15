import React from "react";

type EmptyRowProps = {
  colSpan: number;
  text: string;
};

const EmptyRow = ({ colSpan, text }: EmptyRowProps) => {
  return (
    <tr className="empty-row">
      <td colSpan={colSpan} style={{ textAlign: "left" }}>
        {text}
      </td>
    </tr>
  );
};

export default EmptyRow;
