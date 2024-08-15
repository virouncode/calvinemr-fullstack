import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Migration from "../../components/Admin/Migration/Migration";
import useTitle from "../../hooks/useTitle";

const AdminMigrationPage = () => {
  useTitle("EMR Migration");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Migration</title>
        </Helmet>
      </HelmetProvider>
      <section className="migration-section">
        <Migration />
      </section>
    </>
  );
};

export default AdminMigrationPage;
