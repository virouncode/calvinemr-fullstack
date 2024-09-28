import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { AppointmentType } from "../../../types/api";
import {
  timestampToHumanDateTZ,
  timestampToHumanTimeTZ,
} from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";

type PastAppointmentItemProps = {
  appointment: AppointmentType;
};

const PastAppointmentItem = ({ appointment }: PastAppointmentItemProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  return (
    <li className="patient-appointments__past-item">
      <div className="patient-appointments__past-item-date">
        {appointment.all_day
          ? `${timestampToHumanDateTZ(appointment.start)} (All Day)`
          : `${timestampToHumanDateTZ(
              appointment.start
            )}, ${timestampToHumanTimeTZ(
              appointment.start
            )} - ${timestampToHumanTimeTZ(appointment.end)}`}
      </div>
      <div className="patient-appointments__past-item-infos">
        <div className="patient-appointments__past-item-host">
          With {staffIdToTitleAndName(staffInfos, appointment.host_id)}
        </div>
        <div className="patient-appointments__past-item-reason">
          Reason : {appointment.AppointmentPurpose}
        </div>
      </div>
    </li>
  );
};

export default PastAppointmentItem;
