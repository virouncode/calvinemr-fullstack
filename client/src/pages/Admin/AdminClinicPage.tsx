import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import ClinicInfos from "../../components/Admin/Clinic/ClinicInfos";
import useTitle from "../../hooks/useTitle";

const AdminClinicPage = () => {
  useTitle("Manage clinic");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Manage clinic</title>
        </Helmet>
      </HelmetProvider>
      <section className="clinic">
        <ClinicInfos />
      </section>
    </>
  );
};

export default AdminClinicPage;
