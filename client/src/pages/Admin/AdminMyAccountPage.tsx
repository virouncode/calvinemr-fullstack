import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import MyAccountAdmin from "../../components/Admin/MyAccount/MyAccountAdmin";
import useTitle from "../../hooks/useTitle";

const AdminMyAccountPage = () => {
  useTitle("My personal information");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>My account</title>
        </Helmet>
      </HelmetProvider>
      <section className="myaccount-section">
        <MyAccountAdmin />
      </section>
    </>
  );
};

export default AdminMyAccountPage;
