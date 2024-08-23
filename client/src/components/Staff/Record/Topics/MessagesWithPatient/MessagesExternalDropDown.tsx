import { InfiniteData } from "@tanstack/react-query";
import React from "react";
import { NavLink } from "react-router-dom";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  MessageExternalType,
  XanoPaginatedType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type MessagesExternalDropDownProps = {
  topicDatas:
    | InfiniteData<XanoPaginatedType<MessageExternalType>, unknown>
    | undefined;
  isPending: boolean;
  error: Error | null;
};

const MessagesExternalDropDown = ({
  topicDatas,
  isPending,
  error,
}: MessagesExternalDropDownProps) => {
  const { user } = useUserContext() as { user: UserStaffType };

  const getSection = (message: MessageExternalType) => {
    if (message.deleted_by_staff_id === user.id) {
      return "Deleted messages";
    } else if (message.from_staff_id && message.from_staff_id === user.id) {
      return "Sent messages";
    } else {
      return "Received messages";
    }
  };
  if (isPending)
    return (
      <div className="topic-content">
        <CircularProgressMedium />
      </div>
    );
  if (error)
    return (
      <div className="topic-content">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  const datas = topicDatas?.pages
    .flatMap((page) => page.items)
    .filter(
      (message) =>
        (message.from_staff_id && message.from_staff_id === user.id) ||
        (message.to_staff_id && message.to_staff_id === user.id)
    );

  return (
    <div className="topic-content">
      {datas && datas.length > 0 ? (
        <ul className="topic-content__list">
          {datas.slice(0, 4).map((message) => (
            <li className="topic-content__item" key={message.id}>
              <div className="topic-content__overview">
                <NavLink
                  style={{ textDecoration: "underline", color: "#327AE6" }}
                  to={`/staff/messages/${message.id}/${getSection(
                    message
                  )}/External`}
                  // target="_blank"
                >
                  {message.subject} - {message.body}
                </NavLink>
              </div>
              <div className="topic-content__date">
                <NavLink
                  style={{ textDecoration: "underline", color: "#327AE6" }}
                  to={`/staff/messages/${message.id}/${getSection(
                    message
                  )}/External`}
                  // target="_blank"
                >
                  {timestampToDateISOTZ(message.date_created)}
                </NavLink>
              </div>
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No messages with patient"
      )}
    </div>
  );
};

export default MessagesExternalDropDown;
