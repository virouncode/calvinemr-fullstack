import useUserContext from "../../../hooks/context/useUserContext";

const MessagingToggle = ({ isTypeChecked, handleMsgsTypeChanged }) => {
  const { user } = useUserContext();
  return (
    <div className="messages-toggle">
      <div className="messages-toggle__radio">
        <input
          type="radio"
          value="Internal"
          name="Internal"
          checked={isTypeChecked("Internal")}
          onChange={handleMsgsTypeChanged}
          id="internal"
        />
        <label htmlFor="internal">
          Internal{" "}
          {user.unreadMessagesNbr || user.unreadTodosNbr
            ? `(${user.unreadMessagesNbr + user.unreadTodosNbr})`
            : ""}
        </label>
      </div>
      <div className="messages-toggle__radio">
        <input
          type="radio"
          value="External"
          name="External"
          checked={isTypeChecked("External")}
          onChange={handleMsgsTypeChanged}
          id="external"
        />
        <label htmlFor="external">
          External{" "}
          {user.unreadMessagesExternalNbr
            ? `(${user.unreadMessagesExternalNbr})`
            : ""}
        </label>
      </div>
    </div>
  );
};

export default MessagingToggle;
