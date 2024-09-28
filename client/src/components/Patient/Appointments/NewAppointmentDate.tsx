import { DateTimeFormatOptions } from "luxon";
import React from "react";
import { AppointmentProposalType } from "../../../types/app";
import {
  timestampToHumanDateTZ,
  timestampToHumanTimeTZ,
} from "../../../utils/dates/formatDates";

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
    <label>
      {timestampToHumanDateTZ(appointment.start)},{" "}
      {timestampToHumanTimeTZ(appointment.start)} -{" "}
      {timestampToHumanTimeTZ(appointment.end)}
    </label>
  );
};

export default NewAppointmentDate;
