import React from "react";
import { AppointmentType } from "../../../types/api";
import EmptyLi from "../../UI/Lists/EmptyLi";
import PastAppointmentItem from "./PastAppointmentItem";

type PastAppointmentsProps = {
  pastAppointments: AppointmentType[];
};

const PastAppointments = ({ pastAppointments }: PastAppointmentsProps) => {
  return (
    <div className="patient-appointments__past">
      <div className="patient-appointments__past-title">Past Appointments</div>
      <div className="patient-appointments__past-content">
        <ul>
          {pastAppointments && pastAppointments.length > 0 ? (
            pastAppointments.map((appointment) => (
              <PastAppointmentItem
                key={appointment.start}
                appointment={appointment}
              />
            ))
          ) : (
            <EmptyLi text="No past appointments" />
          )}
        </ul>
      </div>
    </div>
  );
};

export default PastAppointments;
