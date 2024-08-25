import React from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { DemographicsType, MessageExternalType } from "../../../../types/api";
import { timestampToDateTimeStrTZ } from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";

type MessageExternalProps = {
  message: MessageExternalType;
  index: number;
};

const MessageExternal = ({ message, index }: MessageExternalProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  return (
    <div className="message" style={{ marginLeft: `${index * 20}px` }}>
      <div className="message__title">
        <div className="message__author">
          From:{" "}
          {message.from_staff_id
            ? staffIdToTitleAndName(staffInfos, message.from_staff_id)
            : toPatientName(message.from_patient_infos)}
        </div>
        <div className="message__date">
          <div>{timestampToDateTimeStrTZ(message.date_created)}</div>
        </div>
      </div>
      <div className="message__subtitle">
        to:{" "}
        {message.to_staff_id
          ? staffIdToTitleAndName(staffInfos, message.to_staff_id)
          : (
              message.to_patients_ids as {
                to_patient_infos: DemographicsType;
              }[]
            )
              .map(({ to_patient_infos }) => toPatientName(to_patient_infos))
              .join(" / ")}
      </div>
      <div className="message__body">{message.body}</div>
    </div>
  );
};

export default MessageExternal;
