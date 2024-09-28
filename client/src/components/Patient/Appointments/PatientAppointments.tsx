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
  //Hooks
  const { user } = useUserContext() as { user: UserPatientType };
  //Queries
  const {
    data: patientAppointments,
    error,
    isPending,
  } = usePatientAppointments(user.id);

  if (isPending)
    return (
      <div className="patient-appointments__past-next">
        <LoadingParagraph />
      </div>
    );

  if (error)
    return (
      <div className="patient-appointments__past-next">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  const pastAppointments = getPastPatientAppointments(patientAppointments);
  const nextAppointments = getNextPatientAppointments(patientAppointments);

  return (
    <>
      <div className="patient-appointments__past-next">
        <PastAppointments pastAppointments={pastAppointments} />
        <NextAppointments nextAppointments={nextAppointments} />
      </div>
      <NewAppointments />{" "}
    </>
  );
};

export default PatientAppointments;
