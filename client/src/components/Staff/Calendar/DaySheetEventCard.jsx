
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { timestampToHumanTimeTZ } from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../utils/names/toPatientName";

const DaySheetEventCard = ({ event }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <div className="daysheet__event-card">
      <div className="daysheet__event-card-header">
        {!event.allDay ? (
          <span>
            {timestampToHumanTimeTZ(event.start)}
            {" - "}
            {timestampToHumanTimeTZ(event.end)}
          </span>
        ) : (
          <span>All day</span>
        )}
        {" : "}
        {event.extendedProps.purpose ?? "Appointment"}
      </div>
      <div className="daysheet__event-card-content">
        <div>
          <span>
            {event.extendedProps.patientsGuestsIds?.length
              ? event.extendedProps.patientsGuestsIds.map(
                  (patient_guest) =>
                    patient_guest && (
                      <span key={patient_guest.patient_infos.patient_id}>
                        <strong>
                          {toPatientName(
                            patient_guest.patient_infos
                          ).toUpperCase()}
                        </strong>
                        {" / "}
                      </span>
                    )
                )
              : null}
            {event.extendedProps.staffGuestsIds?.length
              ? event.extendedProps.staffGuestsIds.map(
                  (staff_guest, index) =>
                    staff_guest && (
                      <span key={staff_guest.staff_infos.id}>
                        <strong>
                          {staffIdToTitleAndName(
                            staffInfos,
                            staff_guest.staff_infos.id
                          ).toUpperCase()}
                        </strong>
                        {index !==
                        event.extendedProps.staffGuestsIds?.length - 1
                          ? " / "
                          : ""}
                      </span>
                    )
                )
              : null}
          </span>
        </div>
        <div>
          <strong>Host: </strong>
          {event.extendedProps.hostName}
        </div>
        <div>
          <strong>Site: </strong>
          {event.extendedProps.siteName}
        </div>
        <div>
          <strong>Room: </strong>
          {event.extendedProps.roomTitle}
        </div>
        <div>
          <strong>{event.extendedProps.status.toUpperCase()}</strong>
        </div>
        <div>
          <strong>Notes: </strong>
          {event.extendedProps.notes}
        </div>
      </div>
    </div>
  );
};

export default DaySheetEventCard;
