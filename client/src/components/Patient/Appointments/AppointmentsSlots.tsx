import React, { useEffect, useState } from "react";
import {
  AppointmentType,
  AvailabilityType,
  StaffType,
} from "../../../types/api";
import { AppointmentProposalType } from "../../../types/app";
import { getAvailableAppointments } from "../../../utils/appointments/getAvailableAppointments";
import CircularProgressMedium from "../../UI/Progress/CircularProgressMedium";
import AppointmentSlotItem from "./AppointmentSlotItem";

type AppointmentsSlotsProps = {
  availability: AvailabilityType;
  appointmentsInRange: AppointmentType[] | null;
  practicianSelectedId: number;
  staffInfos: StaffType[];
  rangeStart: number;
  setAppointmentSelected: React.Dispatch<
    React.SetStateAction<AppointmentProposalType | null>
  >;
  appointmentSelected: AppointmentProposalType | null;
};

const AppointmentsSlots = ({
  availability,
  appointmentsInRange,
  practicianSelectedId,
  staffInfos,
  rangeStart,
  setAppointmentSelected,
  appointmentSelected,
}: AppointmentsSlotsProps) => {
  const [appointmentsOptions, setAppointmentsOptions] = useState<
    AppointmentProposalType[]
  >([]);

  useEffect(() => {
    setAppointmentsOptions(
      getAvailableAppointments(
        availability,
        appointmentsInRange,
        practicianSelectedId,
        rangeStart
      )
    );
  }, [appointmentsInRange, availability, practicianSelectedId, rangeStart]);
  return (
    availability &&
    appointmentsInRange && (
      <div className="new-appointments__content">
        {appointmentsOptions ? (
          appointmentsOptions.length ? (
            appointmentsOptions.map((appointment) => (
              <AppointmentSlotItem
                key={appointment.id}
                appointment={appointment}
                staffInfos={staffInfos}
                setAppointmentSelected={setAppointmentSelected}
                appointmentSelected={appointmentSelected}
              />
            ))
          ) : (
            <div>No appointments available this week</div>
          )
        ) : (
          <CircularProgressMedium />
        )}
      </div>
    )
  );
};

export default AppointmentsSlots;
