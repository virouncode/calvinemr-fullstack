import React, { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import CredentialsForm from "../../components/Staff/Credentials/CredentialsForm";
import VerifyPassword from "../../components/Staff/Credentials/VerifyPassword";
import useTitle from "../../hooks/useTitle";

const StaffCredentialsPage = () => {
  const [verified, setVerified] = useState(false);
  useTitle("Change login credentials");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Credentials</title>
        </Helmet>
      </HelmetProvider>
      <section className="credentials">
        {!verified ? (
          <VerifyPassword setVerified={setVerified} />
        ) : (
          <CredentialsForm />
        )}
      </section>
    </>
  );
};

export default StaffCredentialsPage;
