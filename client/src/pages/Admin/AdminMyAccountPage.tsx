import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import MyAccountAdmin from "../../components/Admin/MyAccount/MyAccountAdmin";
import useTitle from "../../hooks/useTitle";

const AdminMyAccountPage = () => {
  useTitle("My account");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>My account</title>
        </Helmet>
      </HelmetProvider>
      <section className="myaccount">
        <MyAccountAdmin />
      </section>
    </>
  );
};

export default AdminMyAccountPage;
