import React from "react";
import { NavLink } from "react-router-dom";
import { RelationshipType } from "../../../../../types/api";
import { toPatientName } from "../../../../../utils/names/toPatientName";

type RelationshipsDropDownProps = {
  data: RelationshipType[];
};

const RelationshipsDropDown = ({ data }: RelationshipsDropDownProps) => {
  return (
    <div className="topic-content">
      {data && data.length > 0 ? (
        <ul>
          {data.slice(0, 4).map((item) => (
            <li key={item.id} className="topic-content__item">
              - {item.relationship} of{" "}
              <NavLink
                to={`/staff/patient-record/${item.relation_id}`}
                className="topic-content__link"
              >
                {toPatientName(item.relation_infos)}
              </NavLink>
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No relationships"
      )}
    </div>
  );
};

export default RelationshipsDropDown;
