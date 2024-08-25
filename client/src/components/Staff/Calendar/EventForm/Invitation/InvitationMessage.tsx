import React from "react";

type InvitationMessageProps = {
  message: string;
  handleMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const InvitationMessage = ({
  message,
  handleMessageChange,
}: InvitationMessageProps) => {
  return (
    <div className="invitation__row">
      <label htmlFor="message">Message</label>
      <textarea
        onChange={handleMessageChange}
        value={message}
        style={{ height: "170px" }}
        id="message"
      />
    </div>
  );
};

export default InvitationMessage;
