import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import MyAccountPatient from "../../components/Patient/MyAccount/MyAccountPatient";
import useTitle from "../../hooks/useTitle";

const PatientMyAccountPage = () => {
  useTitle("My account");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>My account</title>
        </Helmet>
      </HelmetProvider>
      <section className="patient-account">
        <MyAccountPatient />
      </section>
    </>
  );
};

export default PatientMyAccountPage;
