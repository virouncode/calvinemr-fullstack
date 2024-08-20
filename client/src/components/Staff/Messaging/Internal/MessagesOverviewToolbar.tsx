import React from "react";

type MessagesOverviewToolbarProps = {
  section: string;
};

const MessagesOverviewToolbar = ({ section }: MessagesOverviewToolbarProps) => {
  return (
    <div className="messages-overview__toolbar">
      <div className="messages-overview__from">
        {section === "Sent messages" ? "To" : "From"}
      </div>
      <div
        className={
          section !== "To-dos"
            ? "messages-overview__subject"
            : "messages-overview__subject messages-overview__subject--todo"
        }
      >
        {`Subject / ${section !== "To-dos" ? "Message" : "To-do"} overview`}
      </div>
      <div
        className={
          section !== "To-dos"
            ? "messages-overview__patient"
            : "messages-overview__patient messages-overview__patient--todo"
        }
      >
        Related patient
      </div>
      <div className="messages-overview__date">Date</div>
      {section === "To-dos" && (
        <>
          <div className="messages-overview__duedate">Due Date</div>
        </>
      )}
      <div
        className={
          section === "To-dos"
            ? "messages-overview__fakediv messages-overview__fakediv--todo"
            : "messages-overview__fakediv"
        }
      ></div>
    </div>
  );
};

export default MessagesOverviewToolbar;
