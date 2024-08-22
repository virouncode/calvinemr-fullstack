import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { AppointmentType } from "../../../types/api";
import {
  timestampToHumanDateTZ,
  timestampToHumanDateTimeTZ,
} from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";

type PastAppointmentItemProps = {
  appointment: AppointmentType;
};

const PastAppointmentItem = ({ appointment }: PastAppointmentItemProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  return (
    <li className="appointments-patient__item">
      <div className="appointments-patient__date" style={{ width: "50%" }}>
        {!appointment.all_day ? (
          <>
            <div style={{ width: "45%", textAlign: "center" }}>
              {timestampToHumanDateTimeTZ(appointment.start)}
            </div>
            <div style={{ width: "10%", textAlign: "center" }}>-</div>
            <div style={{ width: "45%", textAlign: "center" }}>
              {timestampToHumanDateTimeTZ(appointment.end)}
            </div>
          </>
        ) : (
          <div style={{ width: "100%", textAlign: "center" }}>
            {timestampToHumanDateTZ(appointment.start)} {`All Day`}
          </div>
        )}
      </div>
      <div style={{ width: "25%", textAlign: "center" }}>
        Reason : {appointment.AppointmentPurpose}
      </div>
      <div style={{ width: "25%", textAlign: "center" }}>
        {staffIdToTitleAndName(staffInfos, appointment.host_id)}
      </div>
    </li>
  );
};

export default PastAppointmentItem;
