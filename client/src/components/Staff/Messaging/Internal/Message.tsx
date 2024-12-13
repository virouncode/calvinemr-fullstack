import React from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { MessageType, TodoType } from "../../../../types/api";
import { timestampToDateTimeStrTZ } from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";

type MessageProps = {
  message: MessageType | TodoType;
  index: number;
  section: string;
  forSnapshot?: boolean;
};

const Message = ({
  message,
  index,
  section,
  forSnapshot = false,
}: MessageProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  return (
    <div className="message" style={{ marginLeft: `${index * 20}px` }}>
      <div
        className="message__title"
        style={{ fontSize: forSnapshot ? "1.25rem" : "" }}
      >
        <div className="message__author">
          From:{" "}
          {staffIdToTitleAndName(
            staffInfos,
            section !== "To-dos"
              ? (message as MessageType).from_id
              : (message as TodoType).from_staff_id
          )}
        </div>
        <div className="message__date">
          <div>{timestampToDateTimeStrTZ(message.date_created)}</div>
        </div>
      </div>
      {section !== "To-dos" && (
        <div
          className="message__subtitle"
          style={{
            fontSize: forSnapshot ? "1rem" : "",
            overflow: forSnapshot ? "visible" : "",
            overflowWrap: forSnapshot ? "break-word" : "normal",
            whiteSpace: forSnapshot ? "pre-wrap" : "",
          }}
        >
          to:{" "}
          {(message as MessageType).to_staff_ids
            .map((staff_id) => staffIdToTitleAndName(staffInfos, staff_id))
            .join(" / ")}
        </div>
      )}
      <div
        className="message__body"
        style={{ fontSize: forSnapshot ? "1.25rem" : "" }}
      >
        {message.body}
      </div>
    </div>
  );
};

export default Message;
