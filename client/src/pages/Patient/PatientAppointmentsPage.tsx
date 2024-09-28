import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import PatientAppointments from "../../components/Patient/Appointments/PatientAppointments";
import useTitle from "../../hooks/useTitle";

const PatientAppointmentsPage = () => {
  useTitle("Appointments");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Appointments</title>
        </Helmet>
      </HelmetProvider>
      <section className="patient-appointments">
        <PatientAppointments />
      </section>
    </>
  );
};

export default PatientAppointmentsPage;
