import React from "react";
import { InvitationSentType } from "../../../../../types/api";
import EmptyLi from "../../../../UI/Lists/EmptyLi";
import InvitationsHistoryItem from "./InvitationsHistoryItem";

type InvitationsHistoryProps = {
  invitationsSent: InvitationSentType[];
};

const InvitationsHistory = ({ invitationsSent }: InvitationsHistoryProps) => {
  const invitations = invitationsSent.sort((a, b) => b.date - a.date);
  return (
    <div className="invitations-history">
      <div className="invitations-history__disclaimer">
        If you've sent an invitation since the last appointment opening, please
        save (or close) and reopen the appointment to refresh the invitation
        history.
      </div>
      <ul>
        {invitations.length > 0 ? (
          invitations.map((invitation) => (
            <InvitationsHistoryItem
              invitation={invitation}
              key={invitation.date}
            />
          ))
        ) : (
          <EmptyLi text="No invitations sent" />
        )}
      </ul>
    </div>
  );
};

export default InvitationsHistory;
