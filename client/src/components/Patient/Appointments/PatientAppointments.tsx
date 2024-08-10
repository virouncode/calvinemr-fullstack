import React from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { usePatientAppointments } from "../../../hooks/reactquery/queries/appointmentsQueries";
import { UserPatientType } from "../../../types/app";
import { getNextPatientAppointments } from "../../../utils/appointments/getNextPatientAppointments";
import { getPastPatientAppointments } from "../../../utils/appointments/getPastPatientAppointments";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import NewAppointments from "./NewAppointments";
import NextAppointments from "./NextAppointments";
import PastAppointments from "./PastAppointments";

const PatientAppointments = () => {
  const { user } = useUserContext() as { user: UserPatientType };
  const {
    data: patientAppointments,
    error,
    isPending,
  } = usePatientAppointments(user.id);

  if (isPending)
    return (
      <div className="past-next-appointments">
        <LoadingParagraph />
      </div>
    );

  if (error)
    return (
      <div className="past-next-appointments">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  const pastAppointments = getPastPatientAppointments(patientAppointments);
  const nextAppointments = getNextPatientAppointments(patientAppointments);

  return (
    <>
      <div className="past-next-appointments">
        <PastAppointments pastAppointments={pastAppointments} />
        <NextAppointments nextAppointments={nextAppointments} />
      </div>
      <NewAppointments />{" "}
    </>
  );
};

export default PatientAppointments;
