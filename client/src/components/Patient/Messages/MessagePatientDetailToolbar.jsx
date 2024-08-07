import ArrowLeftIcon from "../../UI/Icons/ArrowLeftIcon";
import ExclamationIcon from "../../UI/Icons/ExclamationIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";

const MessagePatientDetailToolbar = ({
  message,
  section,
  handleClickBack,
  handleDeleteMsg,
}) => {
  return (
    <div className="message-detail__toolbar">
      <ArrowLeftIcon onClick={handleClickBack} mr={20} />
      <div className="message-detail__toolbar-subject message-detail__toolbar-subject--patient">
        {message.high_importance && <ExclamationIcon mr={5} />}
        {message.subject}
      </div>

      <div className="message-detail__toolbar-logos">
        {section !== "Deleted messages" && (
          <TrashIcon onClick={handleDeleteMsg} />
        )}
      </div>
    </div>
  );
};

export default MessagePatientDetailToolbar;
