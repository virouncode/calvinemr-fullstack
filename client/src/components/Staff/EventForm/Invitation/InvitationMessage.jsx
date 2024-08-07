const InvitationMessage = ({ message, handleMessageChange }) => {
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
