import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Reference from "../../components/Staff/Reference/Reference";
import useTitle from "../../hooks/useTitle";

const StaffReferencePage = () => {
  useTitle("Reference");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Reference</title>
        </Helmet>
      </HelmetProvider>
      <section className="reference">
        <Reference />
      </section>
    </>
  );
};

export default StaffReferencePage;
