import useSocketContext from "../../../hooks/context/useSocketContext";

const FaxLeftBar = ({
  section,
  setSection,
  setCurrentFaxId,
  setFaxesSelectedIds,
  setSelectAllVisible,
}) => {
  const { socket } = useSocketContext();
  const handleClickSection = (e) => {
    const name = e.target.id;
    setSection(name);
    setCurrentFaxId(0);
    setFaxesSelectedIds([]);
    setSelectAllVisible(true);
    if (name === "Received faxes") {
      socket.emit("message", { key: ["faxes inbox"] });
    } else {
      socket.emit("message", { key: ["faxes outbox"] });
    }
  };
  const isActive = (id) =>
    section === id
      ? "messages-content__category messages-content__category--active"
      : "messages-content__category";

  return (
    <div className="messages-content__leftbar">
      <ul>
        <li
          className={isActive("Received faxes")}
          id="Received faxes"
          onClick={handleClickSection}
        >
          Received faxes
        </li>
        <li className={isActive("Sent")} id="Sent" onClick={handleClickSection}>
          Sent faxes
        </li>
        {/* <li
          className={isActive("Deleted messages")}
          id="Deleted messages"
          onClick={handleClickSection}
        >
          Deleted faxes
        </li> */}
      </ul>
    </div>
  );
};

export default FaxLeftBar;
