import React from "react";
import useSocketContext from "../../../hooks/context/useSocketContext";

type FaxLeftBarProps = {
  section: string;
  setSection: (section: string) => void;
  setCurrentFaxId: React.Dispatch<React.SetStateAction<string>>;
  setFaxesSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectAllVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const FaxLeftBar = ({
  section,
  setSection,
  setCurrentFaxId,
  setFaxesSelectedIds,
  setSelectAllVisible,
}: FaxLeftBarProps) => {
  const { socket } = useSocketContext();
  const handleClickSection = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const name = (e.target as HTMLLIElement).id;
    setSection(name);
    setCurrentFaxId("");
    setFaxesSelectedIds([]);
    setSelectAllVisible(true);
    if (name === "Received faxes") {
      socket?.emit("message", { key: ["faxes inbox"] });
    } else {
      socket?.emit("message", { key: ["faxes outbox"] });
    }
  };
  const isActiveClass = (sectionName: string) =>
    section === sectionName
      ? "messages-content__category messages-content__category--active"
      : "messages-content__category";

  return (
    <div className="messages-content__leftbar">
      <ul>
        <li
          className={isActiveClass("Received faxes")}
          id="Received faxes"
          onClick={handleClickSection}
        >
          Received faxes
        </li>
        <li
          className={isActiveClass("Sent")}
          id="Sent"
          onClick={handleClickSection}
        >
          Sent faxes
        </li>
      </ul>
    </div>
  );
};

export default FaxLeftBar;
