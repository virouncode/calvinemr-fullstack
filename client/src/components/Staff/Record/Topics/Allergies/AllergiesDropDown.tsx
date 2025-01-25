import React from "react";
import { AllergyType } from "../../../../../types/api";

type AllergiesDropDownProps = {
  data: AllergyType[];
};

const AllergiesDropDown = ({ data }: AllergiesDropDownProps) => {
  return (
    <div className="topic-content">
      {data && data.length >= 1 ? (
        <ul>
          {data.slice(0, 4).map((item) => (
            <li key={item.id} className="topic-content__item">
              - {item.OffendingAgentDescription}
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No allergies"
      )}
    </div>
  );
};

export default AllergiesDropDown;
