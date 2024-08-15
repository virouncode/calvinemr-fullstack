import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import SignupPatientForm from "../../components/Staff/Signup/SignupPatientForm";
import useTitle from "../../hooks/useTitle";

const StaffSignupPatientPage = () => {
  useTitle("Create a new patient account");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>New Patient</title>
        </Helmet>
      </HelmetProvider>
      <section className="signup-section">
        <SignupPatientForm />
      </section>
    </>
  );
};

export default StaffSignupPatientPage;
