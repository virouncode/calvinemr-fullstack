import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Closed from "../../components/All/Closed/Closed";

const SuspendedPage = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Closed account</title>
        </Helmet>
      </HelmetProvider>
      <section className="closed">
        <Closed />
      </section>
    </>
  );
};

export default SuspendedPage;
