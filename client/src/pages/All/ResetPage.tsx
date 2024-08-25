import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ForgotPassword from "../../components/All/ResetPassword/ForgotPassword";

const ResetPage = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Forgot Password</title>
        </Helmet>
      </HelmetProvider>
      <section className="reset-section">
        <ForgotPassword />
      </section>
    </>
  );
};

export default ResetPage;
