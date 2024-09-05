import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Missing from "../../components/All/Missing/Missing";

const MissingPage = () => {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Page not found</title>
        </Helmet>
      </HelmetProvider>
      <section className="missing">
        <Missing />
      </section>
    </>
  );
};

export default MissingPage;
