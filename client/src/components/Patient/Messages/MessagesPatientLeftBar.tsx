import React from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { UserPatientType } from "../../../types/app";

type MessagesPatientLeftBarProps = {
  section: string;
  setSection: React.Dispatch<React.SetStateAction<string>>;
  setCurrentMsgId: React.Dispatch<React.SetStateAction<number>>;
  setMsgsSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  setSelectAllVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const MessagesPatientLeftBar = ({
  section,
  setSection,
  setCurrentMsgId,
  setMsgsSelectedIds,
  setSelectAllVisible,
}: MessagesPatientLeftBarProps) => {
  const { user } = useUserContext() as { user: UserPatientType };
  const handleClickSection = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const name = (e.target as HTMLLIElement).id;
    setSection(name);
    setCurrentMsgId(0);
    setMsgsSelectedIds([]);
    setSelectAllVisible(true);
  };
  const isActive = (id: string) =>
    section === id
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
          {"Received messages" + (user.unreadNbr ? ` (${user.unreadNbr})` : "")}
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
      </ul>
    </div>
  );
};

export default MessagesPatientLeftBar;
