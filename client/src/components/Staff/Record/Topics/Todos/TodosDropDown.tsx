import React from "react";
import { NavLink } from "react-router-dom";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { TodoType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";

type TodosDropDownProps = {
  data: TodoType[];
};

const TodosDropDown = ({ data }: TodosDropDownProps) => {
  const { user } = useUserContext() as { user: UserStaffType };

  const datas = data.filter((message) => message.to_staff_id === user.id);

  return (
    <div className="topic-content">
      {datas && datas.length > 0 ? (
        <ul>
          {datas.slice(0, 4).map((message) => (
            <li
              className="topic-content__item"
              key={message.id}
              style={{ textDecoration: message.done ? "line-through" : "none" }}
            >
              <div className="topic-content__overview">
                <NavLink
                  style={{ textDecoration: "underline", color: "#327AE6" }}
                  to={`/staff/messages/${message.id}/To-dos/Internal`}
                >
                  {message.subject} - {message.body}
                </NavLink>
              </div>
              <div className="topic-content__date">
                <NavLink
                  style={{ textDecoration: "underline", color: "#327AE6" }}
                  to={`/staff/messages/${message.id}/To-dos/Internal`}
                >
                  {timestampToDateISOTZ(message.date_created)}
                </NavLink>
              </div>
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No to-dos about patient"
      )}
    </div>
  );
};

export default TodosDropDown;
