import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Logs from "../../components/Admin/LoginLogs/Logs";
import useTitle from "../../hooks/useTitle";

const AdminLogsPage = () => {
  useTitle("Logs");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Logs</title>
        </Helmet>
      </HelmetProvider>
      <section className="logs">
        <Logs />
      </section>
    </>
  );
};

export default AdminLogsPage;
