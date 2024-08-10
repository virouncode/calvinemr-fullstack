import React from "react";
import { StaffType } from "../../../types/api";
import { AppointmentProposalType } from "../../../types/app";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import Checkbox from "../../UI/Checkbox/Checkbox";
import NewAppointmentDate from "./NewAppointmentDate";

type AppointmentSlotItemProps = {
  appointment: AppointmentProposalType;
  staffInfos: StaffType[];
  appointmentSelected: AppointmentProposalType | null;
  setAppointmentSelected: React.Dispatch<
    React.SetStateAction<AppointmentProposalType | null>
  >;
};

const AppointmentSlotItem = ({
  appointment,
  staffInfos,
  setAppointmentSelected,
  appointmentSelected,
}: AppointmentSlotItemProps) => {
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked) setAppointmentSelected(appointment);
    else setAppointmentSelected(null);
  };
  const isAppointmentSelected = (id: number) => appointmentSelected?.id === id;
  return (
    <div key={appointment.id} className="new-appointments__content-item">
      <Checkbox
        checked={isAppointmentSelected(appointment.id)}
        onChange={handleCheck}
        mr={10}
      />
      <div className="new-appointments__content-item-date">
        <NewAppointmentDate appointment={appointment} />
      </div>
      <p>Reason : {appointment?.reason}</p>
      <p>{staffIdToTitleAndName(staffInfos, appointment.host_id)}</p>
    </div>
  );
};

export default AppointmentSlotItem;
