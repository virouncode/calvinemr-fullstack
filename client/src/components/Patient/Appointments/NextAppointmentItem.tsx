import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { AppointmentType } from "../../../types/api";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import Checkbox from "../../UI/Checkbox/Checkbox";
import NextAppointmentDate from "./NextAppointmentDate";

type NextAppointmentItemProps = {
  appointment: AppointmentType;
  isAppointmentSelected: (id: number) => boolean;
  handleCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const NextAppointmentItem = ({
  appointment,
  isAppointmentSelected,
  handleCheck,
}: NextAppointmentItemProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  return (
    <li key={appointment.id} className="patient-appointments__next-item">
      <div className="patient-appointments__next-item-date">
        <Checkbox
          id={appointment.id.toString()}
          onChange={handleCheck}
          checked={isAppointmentSelected(appointment.id)}
        />
        <NextAppointmentDate appointment={appointment} />
      </div>
      <div className="patient-appointments__next-item-infos">
        <div className="patient-appointments__next-item-host">
          With {staffIdToTitleAndName(staffInfos, appointment.host_id)}
        </div>
        <div className="patient-appointments__next-item-reason">
          Reason : {appointment.AppointmentPurpose}
        </div>
      </div>
    </li>
  );
};

export default NextAppointmentItem;
