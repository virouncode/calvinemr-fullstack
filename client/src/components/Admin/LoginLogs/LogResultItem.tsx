import React from "react";
import { LogType } from "../../../types/api";
import { timestampToHumanDateTimeSecondsTZ } from "../../../utils/dates/formatDates";

type LogResultItemProps = {
  log: LogType;
  lastLogRef?: (node: Element | null) => void;
};

const LogResultItem = ({ log, lastLogRef }: LogResultItemProps) => {
  return (
    <tr ref={lastLogRef}>
      <td>{timestampToHumanDateTimeSecondsTZ(log.created_at)}</td>
      <td>{log.user_id}</td>
      <td>{log.user_name}</td>
      <td>{log.user_type}</td>
      <td>{log.ip_address}</td>
    </tr>
  );
};

export default LogResultItem;
