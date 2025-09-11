import React from "react";
import usePurposesContext from "../../../../../hooks/context/usePuposesContext";
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
  const { purposes } = usePurposesContext();
  //FIND NEXT APPOINTMENT
  const nextAppointment = getNextPatientAppointments(
    data as AppointmentType[]
  )[0];

  const purposesNames = nextAppointment?.purposes_ids
    ? nextAppointment.purposes_ids
        .map((id) => {
          const purpose = purposes.find((purpose) => purpose.id === id);
          return purpose ? purpose.name : null;
        })
        .filter((name) => name !== null)
        .join(" - ")
    : "TBD";

  return (
    <div className="topic-content">
      {nextAppointment ? (
        <>
          <label style={{ fontWeight: "bold" }}>Next appointment: </label>
          <span>
            {!nextAppointment.all_day
              ? timestampToDateTimeStrTZ(nextAppointment.start)
              : timestampToDateISOTZ(nextAppointment.start) + " All Day"}{" "}
            ({purposesNames})
          </span>
        </>
      ) : (
        "No appointment scheduled"
      )}
    </div>
  );
};

export default AppointmentsDropdown;
