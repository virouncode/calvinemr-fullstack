import React from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { UserStaffType } from "../../../types/app";
import Radio from "../../UI/Radio/Radio";

type MessagingToggleProps = {
  isTypeChecked: (type: string) => boolean;
  handleMsgTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const MessagingToggle = ({
  isTypeChecked,
  handleMsgTypeChange,
}: MessagingToggleProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  return (
    <div className="messages__toggle">
      <div className="messages__toggle-radio">
        <Radio
          id="internal"
          name="message-type"
          value="Internal"
          checked={isTypeChecked("Internal")}
          onChange={handleMsgTypeChange}
          label={
            "Internal" +
            (user.unreadMessagesNbr || user.unreadTodosNbr
              ? ` (${user.unreadMessagesNbr + user.unreadTodosNbr})`
              : "")
          }
        />
      </div>
      <div className="messages__toggle-radio">
        <Radio
          id="external"
          name="message-type"
          value="External"
          checked={isTypeChecked("External")}
          onChange={handleMsgTypeChange}
          label={
            "External" +
            (user.unreadMessagesExternalNbr
              ? ` (${user.unreadMessagesExternalNbr})`
              : "")
          }
        />
      </div>
    </div>
  );
};

export default MessagingToggle;
