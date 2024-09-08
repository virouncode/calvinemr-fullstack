import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import MyAccountStaff from "../../components/Staff/MyAccount/MyAccountStaff";
import useTitle from "../../hooks/useTitle";

const StaffMyAccountPage = () => {
  useTitle("My account");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>My account</title>
        </Helmet>
      </HelmetProvider>
      <section className="myaccount">
        <MyAccountStaff />
      </section>
    </>
  );
};

export default StaffMyAccountPage;
