import React, { useEffect, useState } from "react";
import {
  AppointmentModeType,
  AppointmentType,
  AvailabilityType,
  StaffType,
} from "../../../types/api";
import { AppointmentProposalType } from "../../../types/app";
import { getAvailableAppointments } from "../../../utils/appointments/getAvailableAppointments";
import AppointmentModeSelect from "../../UI/Lists/AppointmentModeSelect";
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
  //Hooks
  const [appointmentsProposals, setAppointmentsProposals] = useState<
    AppointmentProposalType[]
  >([]);
  const [appointmentMode, setAppointmentMode] =
    useState<AppointmentModeType>("in-person");

  useEffect(() => {
    setAppointmentsProposals(
      getAvailableAppointments(
        availability,
        appointmentsInRange,
        practicianSelectedId,
        rangeStart,
        appointmentMode
      )
    );
  }, [
    appointmentsInRange,
    availability,
    practicianSelectedId,
    rangeStart,
    appointmentMode,
  ]);

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value as AppointmentModeType;
    setAppointmentMode(newMode);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          marginTop: "1rem",
          marginBottom: "1rem",
          marginLeft: "1rem",
        }}
      >
        <AppointmentModeSelect
          label="Appointment type"
          mode={appointmentMode}
          handleModeChange={handleModeChange}
        />
      </div>

      {appointmentsProposals ? (
        appointmentsProposals.length ? (
          appointmentsProposals.map((appointment) => (
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
    </>
  );
};

export default AppointmentsSlots;
