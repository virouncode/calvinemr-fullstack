import React from "react";
import { AppointmentType } from "../../../../types/api";
import AppointmentModeSelect from "../../../UI/Lists/AppointmentModeSelect";

type AppointmentModeSelectProps = {
  formDatas: AppointmentType;
  handleModeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const EventFormAppointmentType = ({
  formDatas,
  handleModeChange,
}: AppointmentModeSelectProps) => {
  return (
    <AppointmentModeSelect
      label={"Appointment type"}
      handleModeChange={handleModeChange}
      mode={formDatas.appointment_type}
      allowEmpty={true}
    />
  );
};

export default EventFormAppointmentType;
