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
  const { staffInfos } = useStaffInfosContext();
  return (
    <li key={appointment.id} className="appointments-patient__item">
      <div className="appointments-patient__date" style={{ width: "50%" }}>
        <Checkbox
          id={appointment.id.toString()}
          onChange={handleCheck}
          checked={isAppointmentSelected(appointment.id)}
        />
        <NextAppointmentDate appointment={appointment} />
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

export default NextAppointmentItem;
