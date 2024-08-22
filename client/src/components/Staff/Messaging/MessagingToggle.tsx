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
    <div className="messages-toggle">
      <div className="messages-toggle__radio">
        <Radio
          id="internal"
          name="Internal"
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
      <div className="messages-toggle__radio">
        <Radio
          id="external"
          name="External"
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
