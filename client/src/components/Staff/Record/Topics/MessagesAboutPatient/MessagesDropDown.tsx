import React from "react";
import { NavLink } from "react-router-dom";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { MessageType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";

type MessagesDropDownProps = {
  data: MessageType[];
};

const MessagesDropDown = ({ data }: MessagesDropDownProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const getSection = (message: MessageType) => {
    if (message.deleted_by_staff_ids.includes(user.id)) {
      return "Deleted messages";
    } else if (message.from_id === user.id) {
      //et le cas forward ???
      return "Sent messages";
    } else {
      return "Received messages";
    }
  };

  const datas = data.filter(
    (message) =>
      message.from_id === user.id || message.to_staff_ids.includes(user.id)
  );

  return (
    <div className="topic-content">
      {datas && datas.length > 0 ? (
        <ul>
          {datas.slice(0, 4).map((message) => (
            <li className="topic-content__item" key={message.id}>
              <div className="topic-content__overview">
                <NavLink
                  to={`/staff/messages/${message.id}/${getSection(
                    message
                  )}/Internal`}
                  style={{ textDecoration: "underline" }}
                >
                  - {message.subject} - {message.body}
                </NavLink>
              </div>
              <div className="topic-content__date">
                <NavLink
                  to={`/staff/messages/${message.id}/${getSection(
                    message
                  )}/Internal`}
                  style={{ textDecoration: "underline" }}
                >
                  {timestampToDateISOTZ(message.date_created)}
                </NavLink>
              </div>
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No messages about patient"
      )}
    </div>
  );
};

export default MessagesDropDown;
