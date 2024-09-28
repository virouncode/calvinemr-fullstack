import React from "react";

type MessagesExternalOverviewToolbarProps = {
  section: string;
};

const MessagesExternalOverviewToolbar = ({
  section,
}: MessagesExternalOverviewToolbarProps) => {
  return (
    <div className="messages__overview-toolbar messages__overview-toolbar--external">
      <div className="messages__overview-from">
        {section === "Sent messages" ? "To" : "From"}
      </div>
      <div className="messages__overview-subject">
        Subject / Message overview
      </div>
      <div className="messages__overview-date">Date</div>
      <div className="messages__overview-fakediv"></div>
    </div>
  );
};

export default MessagesExternalOverviewToolbar;
