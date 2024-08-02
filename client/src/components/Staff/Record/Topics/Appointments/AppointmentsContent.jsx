
import { getNextPatientAppointments } from "../../../../../utils/appointments/getNextPatientAppointments";
import {
    timestampToDateISOTZ,
    timestampToDateTimeStrTZ,
} from "../../../../../utils/dates/formatDates";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const AppointmentsContent = ({ topicDatas, isPending, error }) => {
  if (isPending)
    return (
      <div className="topic-content">
        <CircularProgressMedium />
      </div>
    );
  if (error)
    return (
      <div className="topic-content">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  const datas = topicDatas.pages.flatMap((page) => page.items);

  //FIND NEXT APPOINTMENT
  const nextAppointment = getNextPatientAppointments(datas)[0];

  return (
    <div className="topic-content">
      {nextAppointment ? (
        <>
          <label style={{ fontWeight: "bold" }}>Next appointment: </label>
          <span>
            {!nextAppointment.all_day
              ? timestampToDateTimeStrTZ(nextAppointment.start)
              : timestampToDateISOTZ(nextAppointment.start) + " All Day"}{" "}
            ({nextAppointment.AppointmentPurpose})
          </span>
        </>
      ) : (
        "No next appointment"
      )}
    </div>
  );
};

export default AppointmentsContent;
