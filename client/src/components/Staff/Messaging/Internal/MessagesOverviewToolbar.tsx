import React from "react";

type MessagesOverviewToolbarProps = {
  section: string;
};

const MessagesOverviewToolbar = ({ section }: MessagesOverviewToolbarProps) => {
  return (
    <div
      className={
        section !== "To-dos"
          ? "messages__overview-toolbar"
          : "messages__overview-toolbar  messages__overview-toolbar--todo"
      }
    >
      <div className="messages__overview-from">
        {section === "Sent messages" ? "To" : "From"}
      </div>
      <div className="messages__overview-subject">
        {`Subject / ${section !== "To-dos" ? "Message" : "To-do"} overview`}
      </div>
      <div className={"messages__overview-patient"}>Related patient</div>
      <div className="messages__overview-date">Date</div>
      {section === "To-dos" && (
        <>
          <div className="messages__overview-duedate">Due Date</div>
        </>
      )}
      <div className="messages__overview-fakediv"></div>
    </div>
  );
};

export default MessagesOverviewToolbar;
