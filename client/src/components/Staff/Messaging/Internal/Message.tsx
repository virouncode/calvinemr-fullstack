import React from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { MessageType, TodoType } from "../../../../types/api";
import { timestampToDateTimeStrTZ } from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";

type MessageProps = {
  message: MessageType | TodoType;
  index: number;
  section: string;
};

const Message = ({ message, index, section }: MessageProps) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <div className="message" style={{ marginLeft: `${index * 20}px` }}>
      <div className="message__title">
        {section !== "To-dos" ? (
          <div className="message__author">
            From:{" "}
            {staffIdToTitleAndName(
              staffInfos,
              (message as MessageType).from_id
            )}
          </div>
        ) : (
          <div className="message__author"></div>
        )}
        <div className="message__date">
          <div>{timestampToDateTimeStrTZ(message.date_created)}</div>
        </div>
      </div>
      {section !== "To-dos" && (
        <div className="message__subtitle">
          to:{" "}
          {(message as MessageType).to_staff_ids
            .map((staff_id) => staffIdToTitleAndName(staffInfos, staff_id))
            .join(" / ")}
        </div>
      )}
      <div className="message__body">{message.body}</div>
    </div>
  );
};

export default Message;
