import { DateTime, DateTimeFormatOptions } from "luxon";
import React from "react";
import { AppointmentProposalType } from "../../../types/app";

type NewAppointmentDateProps = {
  appointment: AppointmentProposalType;
};

const NewAppointmentDate = ({ appointment }: NewAppointmentDateProps) => {
  const optionsDate: DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return (
    <>
      <p>
        {DateTime.fromMillis(appointment.start, {
          zone: "America/Toronto",
          locale: "en-CA",
        }).toLocaleString(optionsDate)}
      </p>
      <p>
        {DateTime.fromMillis(appointment.start, {
          zone: "America/Toronto",
          locale: "en-CA",
        }).toLocaleString(DateTime.TIME_SIMPLE)}{" "}
        -{" "}
        {DateTime.fromMillis(appointment.end, {
          zone: "America/Toronto",
          locale: "en-CA",
        }).toLocaleString(DateTime.TIME_SIMPLE)}
      </p>
    </>
  );
};

export default NewAppointmentDate;
