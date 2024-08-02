const MessagePatientDetailToolbar = ({
  message,
  section,
  handleClickBack,
  handleDeleteMsg,
}) => {
  return (
    <div className="message-detail__toolbar">
      <i
        className="fa-solid fa-arrow-left message-detail__toolbar-arrow"
        style={{ cursor: "pointer" }}
        onClick={handleClickBack}
      />
      <div className="message-detail__toolbar-subject message-detail__toolbar-subject--patient">
        {message.high_importance && (
          <i
            className="fa-solid fa-circle-exclamation"
            style={{ color: "red", marginRight: "5px" }}
          />
        )}
        {message.subject}
      </div>

      <div className="message-detail__toolbar-logos">
        {section !== "Deleted messages" && (
          <i
            className="fa-solid fa-trash  message-detail__trash"
            onClick={handleDeleteMsg}
          />
        )}
      </div>
    </div>
  );
};

export default MessagePatientDetailToolbar;
