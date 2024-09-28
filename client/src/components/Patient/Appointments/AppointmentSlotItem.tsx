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
    <div key={appointment.id} className="patient-appointments__new-item">
      <div className="patient-appointments__new-item-date">
        <Checkbox
          checked={isAppointmentSelected(appointment.id)}
          onChange={handleCheck}
          mr={10}
        />
        <NewAppointmentDate appointment={appointment} />
      </div>
      <div className="patient-appointments__new-item-host">
        With {staffIdToTitleAndName(staffInfos, appointment.host_id)}
      </div>
    </div>
  );
};

export default AppointmentSlotItem;
