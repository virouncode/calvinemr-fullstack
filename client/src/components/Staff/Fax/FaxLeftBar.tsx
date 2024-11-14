import React from "react";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { UserStaffType } from "../../../types/app";

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
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
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
      ? "fax__content-category fax__content-category--active"
      : "fax__content-category";

  return (
    <div className="fax__content-leftbar">
      <ul>
        <li
          className={isActiveClass("Received faxes")}
          id="Received faxes"
          onClick={handleClickSection}
        >
          {"Received faxes" +
            (user.unreadFaxNbr ? ` (${user.unreadFaxNbr})` : "")}
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
