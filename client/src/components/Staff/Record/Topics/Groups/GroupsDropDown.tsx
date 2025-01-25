import React from "react";
import { NavLink } from "react-router-dom";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { DemographicsType, GroupType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";

type GroupsDropDownProps = {
  data: GroupType[];
  patientId: number;
};

const GroupsDropDown = ({ data, patientId }: GroupsDropDownProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const myGroups = data
    ?.filter(({ global }) => !global)
    .filter((item) => item.staff_id === user.id);

  const globalGroups = data?.filter(({ global }) => global);

  return (
    <div className="topic-content">
      {myGroups && myGroups.length > 0 ? (
        <ul>
          <li style={{ fontWeight: "bold" }}>In my groups</li>
          {myGroups.map((item) => (
            <li key={item.id} className="topic-content__item">
              <NavLink
                to={`/staff/groups/${item.id}/${
                  item.global ? "Clinic groups" : "My groups"
                }`}
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                - Ranked{" "}
                {(item.patients as { patient_infos: DemographicsType }[])
                  .map(({ patient_infos }) => patient_infos.patient_id)
                  .indexOf(patientId) + 1}{" "}
                in {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          <li style={{ fontWeight: "bold" }}>Not in my patients groups</li>
        </ul>
      )}
      {globalGroups && globalGroups.length > 0 ? (
        <ul style={{ marginTop: "5px" }}>
          <li style={{ fontWeight: "bold" }}>In clinic groups</li>
          {globalGroups.map((item) => (
            <li key={item.id} className="topic-content__item">
              <NavLink
                to={`/staff/groups/${item.id}/${
                  item.global ? "Clinic groups" : "My groups"
                }`}
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                - Ranked{" "}
                {(item.patients as { patient_infos: DemographicsType }[])
                  .map(({ patient_infos }) => patient_infos.patient_id)
                  .indexOf(patientId) + 1}{" "}
                in {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      ) : (
        <ul style={{ marginTop: "5px" }}>
          <li style={{ fontWeight: "bold" }}>Not in clinic groups</li>
        </ul>
      )}
    </div>
  );
};

export default GroupsDropDown;
