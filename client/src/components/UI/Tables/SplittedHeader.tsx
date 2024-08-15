import React from "react";

type SplittedHeaderProps = {
  leftTitle: string;
  rightTitle: string;
};

const SplittedHeader = ({ leftTitle, rightTitle }: SplittedHeaderProps) => {
  return (
    <th style={{ minWidth: "200px", height: "50px" }}>
      <div
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          top: "0",
          left: "0",
        }}
      >
        <span style={{ position: "absolute", bottom: "5px", left: "4px" }}>
          {leftTitle}
        </span>
        <span
          style={{
            position: "absolute",
            bottom: "25px",
            right: "10px",
          }}
        >
          {rightTitle}
        </span>
        <div
          style={{
            width: "205px",
            height: "46px",
            borderBottom: "1px solid black",
            transform: "translateY(-25px) translateX(-2px) rotate(14deg)",
            position: "absolute",
          }}
        ></div>
      </div>
    </th>
  );
};

export default SplittedHeader;
