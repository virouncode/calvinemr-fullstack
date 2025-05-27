import React from "react";
import { AppointmentType } from "../../../../../types/api";
import { getNextPatientAppointments } from "../../../../../utils/appointments/getNextPatientAppointments";
import {
  timestampToDateISOTZ,
  timestampToDateTimeStrTZ,
} from "../../../../../utils/dates/formatDates";

type AppointmentsDropdownProps = {
  data: AppointmentType[];
};

const AppointmentsDropdown = ({ data }: AppointmentsDropdownProps) => {
  //FIND NEXT APPOINTMENT
  const nextAppointment = getNextPatientAppointments(
    data as AppointmentType[]
  )[0];

  return (
    <div className="topic-content">
      {nextAppointment ? (
        <>
          <label style={{ fontWeight: "bold" }}>Next appointment: </label>
          <span>
            {!nextAppointment.all_day
              ? timestampToDateTimeStrTZ(nextAppointment.start)
              : timestampToDateISOTZ(nextAppointment.start) + " All Day"}{" "}
            ({nextAppointment.AppointmentPurpose})
          </span>
        </>
      ) : (
        "No appointment scheduled"
      )}
    </div>
  );
};

export default AppointmentsDropdown;
