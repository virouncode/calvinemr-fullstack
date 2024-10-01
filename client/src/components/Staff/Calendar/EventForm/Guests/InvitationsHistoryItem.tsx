import React from "react";
import { InvitationSentType } from "../../../../../types/api";
import { timestampToHumanDateTimeTZ } from "../../../../../utils/dates/formatDates";

type InvitationsHistoryItemProps = {
  invitation: InvitationSentType;
};
const InvitationsHistoryItem = ({
  invitation,
}: InvitationsHistoryItemProps) => {
  return (
    <li className="invitations-history__item">
      <div>{timestampToHumanDateTimeTZ(invitation.date)}</div>
      <div>to</div>
      <div>{invitation.guests_names.join(" / ")}</div>
    </li>
  );
};

export default InvitationsHistoryItem;
