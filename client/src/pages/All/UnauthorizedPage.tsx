import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Unauthorized from "../../components/All/Unauthorized/Unauthorized";

const UnauthorizedPage = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Unauthorized</title>
        </Helmet>
      </HelmetProvider>
      <section className="unauthorized">
        <Unauthorized />
      </section>
    </>
  );
};

export default UnauthorizedPage;
