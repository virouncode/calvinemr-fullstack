import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Dashboard from "../../components/Admin/Dashboard/Dashboard";
import useTitle from "../../hooks/useTitle";

const AdminDashboardPage = () => {
  useTitle("Dashboard");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
      </HelmetProvider>
      <section className="dashboard">
        <Dashboard />
      </section>
    </>
  );
};

export default AdminDashboardPage;
