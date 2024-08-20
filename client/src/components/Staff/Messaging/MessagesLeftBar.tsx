import React from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { UserStaffType } from "../../../types/app";

type MessagesLeftBarProps = {
  msgType: string;
  section: string;
  setSection: React.Dispatch<React.SetStateAction<string>>;
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  setMsgsSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectAllVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const MessagesLeftBar = ({
  msgType,
  section,
  setSection,
  setCurrentMsgId,
  setMsgsSelectedIds,
  setSelectAllVisible,
}: MessagesLeftBarProps) => {
  const { user } = useUserContext() as { user: UserStaffType };

  const handleClickSection = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const name = (e.target as HTMLLIElement).id;
    setSection(name);
    setCurrentMsgId(0);
    setMsgsSelectedIds([]);
    setSelectAllVisible(true);
  };
  const isActive = (sectionName: string) =>
    section === sectionName
      ? "messages-content__category messages-content__category--active"
      : "messages-content__category";

  return (
    <div className="messages-content__leftbar">
      <ul>
        <li
          className={isActive("Received messages")}
          id="Received messages"
          onClick={handleClickSection}
        >
          {msgType === "internal"
            ? "Received messages" +
              (user.unreadMessagesNbr ? ` (${user.unreadMessagesNbr})` : "")
            : "Received messages" +
              (user.unreadMessagesExternalNbr
                ? ` (${user.unreadMessagesExternalNbr})`
                : "")}
        </li>
        <li
          className={isActive("Sent messages")}
          id="Sent messages"
          onClick={handleClickSection}
        >
          Sent messages
        </li>
        <li
          className={isActive("Deleted messages")}
          id="Deleted messages"
          onClick={handleClickSection}
        >
          Deleted messages
        </li>
        {user.access_level === "staff" && msgType === "internal" && (
          <li
            className={isActive("To-dos")}
            id="To-dos"
            onClick={handleClickSection}
          >
            {"To-dos" +
              (user.unreadTodosNbr ? ` (${user.unreadTodosNbr})` : "")}
          </li>
        )}
      </ul>
    </div>
  );
};

export default MessagesLeftBar;
