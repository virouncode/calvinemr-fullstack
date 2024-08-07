import Button from "../../../UI/Buttons/Button";
import MessagesAttachments from "../Internal/MessagesAttachments";
import MessageExternal from "./MessageExternal";

const MessagesExternalPrintPU = ({ message, previousMsgs, attachments }) => {
  const CONTAINER_STYLE = {
    fontFamily: "Arial, sans-serif",
  };
  const handleClickPrint = (e) => {
    e.nativeEvent.view.print();
  };
  return (
    <div className="messages-print__container" style={CONTAINER_STYLE}>
      <div className="messages-print__section">
        <div className="messages-print__title">
          <p className="messages-print__subject">
            <strong>Subject:{"\u00A0"}</strong>
            {message.subject}
          </p>
        </div>
        <div className="messages-print__content">
          <MessageExternal message={message} key={message.id} index={0} />
          {previousMsgs &&
            previousMsgs.map((message, index) => (
              <MessageExternal
                message={message}
                key={message.id}
                index={index + 1}
              />
            ))}
          <MessagesAttachments
            attachments={attachments}
            deletable={false}
            cardWidth="20%"
            addable={false}
          />
        </div>
        <div className="messages-print__btn">
          <Button onClick={handleClickPrint} label="Print" />
        </div>
      </div>
    </div>
  );
};

export default MessagesExternalPrintPU;
