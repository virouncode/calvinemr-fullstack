import React from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import { InvitationSentType } from "../../../../../types/api";
import { timestampToHumanDateTimeTZ } from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";

type InvitationsHistoryItemProps = {
  invitation: InvitationSentType;
};
const InvitationsHistoryItem = ({
  invitation,
}: InvitationsHistoryItemProps) => {
  const { staffInfos } = useStaffInfosContext();
  let senderName = "Unknown";
  if (invitation.sent_by) {
    senderName = staffIdToTitleAndName(staffInfos, invitation.sent_by);
  }
  return (
    <li className="invitations-history__item">
      <div>{timestampToHumanDateTimeTZ(invitation.date)}</div>
      <div>to {invitation.guests_names.join(" / ")}</div>
      <div>by {senderName}</div>
      <div>(Type : {invitation.appointment_type || "Unknown"})</div>
    </li>
  );
};

export default InvitationsHistoryItem;
