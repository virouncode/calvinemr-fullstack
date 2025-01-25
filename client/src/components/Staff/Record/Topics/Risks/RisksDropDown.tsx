import React from "react";
import { RiskFactorType } from "../../../../../types/api";

type RisksDropDownProps = {
  data: RiskFactorType[];
};

const RisksDropDown = ({ data }: RisksDropDownProps) => {
  return (
    <div className="topic-content">
      {data && data.length > 0 ? (
        <ul>
          {data.slice(0, 4).map((item) => (
            <li key={item.id} className="topic-content__item">
              - {item.RiskFactor}
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No risk factors"
      )}
    </div>
  );
};

export default RisksDropDown;
