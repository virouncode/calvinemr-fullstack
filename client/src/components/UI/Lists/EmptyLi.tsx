import React from "react";
type EmptyLiProps = {
  text: string;
  paddingLateral?: number;
};

const EmptyLi = ({ text, paddingLateral = 0 }: EmptyLiProps) => {
  return (
    <li
      style={{ padding: `0 ${paddingLateral}px`, fontWeight: "bold" }}
      className="empty-li"
    >
      {text}
    </li>
  );
};

export default EmptyLi;
