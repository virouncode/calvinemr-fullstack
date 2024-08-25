import React from "react";

type MessagesPatientOverviewToolbarProps = {
  section: string;
};

const MessagesPatientOverviewToolbar = ({
  section,
}: MessagesPatientOverviewToolbarProps) => {
  return (
    <div className="messages-overview__toolbar">
      <div className="messages-overview__from">
        {section === "Sent messages" ? "To" : "From"}
      </div>
      <div className="messages-overview__subject messages-overview__subject--external">
        Subject / Message overview
      </div>
      <div className="messages-overview__date messages-overview__date--external">
        Date
      </div>
      <div className="messages-overview__fakediv"></div>
    </div>
  );
};

export default MessagesPatientOverviewToolbar;
