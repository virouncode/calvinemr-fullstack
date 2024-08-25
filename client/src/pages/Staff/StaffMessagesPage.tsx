import React, { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useParams } from "react-router-dom";
import MessagesExternal from "../../components/Staff/Messaging/External/MessagesExternal";
import Messages from "../../components/Staff/Messaging/Internal/Messages";
import MessagingToggle from "../../components/Staff/Messaging/MessagingToggle";
import useTitle from "../../hooks/useTitle";

const StaffMessagesPage = () => {
  const { msgType } = useParams();
  const [msgsType, setMsgsType] = useState(msgType || "Internal");
  const isTypeChecked = (type: string) => {
    return type === msgsType ? true : false;
  };
  const handleMsgTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMsgsType(value);
  };
  useTitle("Messages");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Messages</title>
        </Helmet>
      </HelmetProvider>
      <section className="messages-section">
        <MessagingToggle
          isTypeChecked={isTypeChecked}
          handleMsgTypeChange={handleMsgTypeChange}
        />
        {msgsType === "Internal" ? <Messages /> : <MessagesExternal />}
      </section>
    </>
  );
};

export default StaffMessagesPage;
