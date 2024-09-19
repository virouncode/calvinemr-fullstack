import React from "react";
type EmptyLiProps = {
  text: string;
};

const EmptyLi = ({ text }: EmptyLiProps) => {
  return <li className="empty-li">{text}</li>;
};

export default EmptyLi;
