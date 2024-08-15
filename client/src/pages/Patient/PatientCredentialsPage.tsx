import React, { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import CredentialsFormPatient from "../../components/Patient/Credentials/CredentialsFormPatient";
import VerifyPasswordPatient from "../../components/Patient/Credentials/VerifyPasswordPatient";
import useTitle from "../../hooks/useTitle";

const PatientCredentialsPage = () => {
  const [verified, setVerified] = useState(false);
  useTitle("Change login credentials");

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Credentials</title>
        </Helmet>
      </HelmetProvider>
      <section className="credentials-section">
        {!verified ? (
          <VerifyPasswordPatient setVerified={setVerified} />
        ) : (
          <CredentialsFormPatient />
        )}
      </section>
    </>
  );
};

export default PatientCredentialsPage;
