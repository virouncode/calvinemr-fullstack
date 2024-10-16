import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import PatientsDirectory from "../../components/Staff/Record/Search/PatientsDirectory";
import useTitle from "../../hooks/useTitle";

const AdminPatientsAccountsPage = () => {
  useTitle("Patients Accounts");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Patients</title>
        </Helmet>
      </HelmetProvider>
      <section className="search-patient">
        <PatientsDirectory />
      </section>
    </>
  );
};

export default AdminPatientsAccountsPage;
