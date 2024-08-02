
import EmptyLi from "../../UI/Lists/EmptyLi";
import PastAppointmentItem from "./PastAppointmentItem";

const PastAppointments = ({ pastAppointments }) => {
  return (
    <div className="appointments-patient appointments-patient--past">
      <div className="appointments-patient__title">Past Appointments</div>
      <div className="appointments-patient__content">
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
