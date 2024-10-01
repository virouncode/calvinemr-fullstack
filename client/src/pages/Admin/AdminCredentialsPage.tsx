import React, { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import CredentialsFormAdmin from "../../components/Admin/Credentials/CredentialsFormAdmin";
import VerifyPasswordAdmin from "../../components/Admin/Credentials/VerifyPasswordAdmin";
import useTitle from "../../hooks/useTitle";

const AdminCredentialsPage = () => {
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
          <VerifyPasswordAdmin setVerified={setVerified} />
        ) : (
          <CredentialsFormAdmin />
        )}
      </section>
    </>
  );
};

export default AdminCredentialsPage;
