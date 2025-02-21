import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import PracticiansDirectory from "../../components/Staff/PracticiansDirectory/PracticiansDirectory";
import useTitle from "../../hooks/useTitle";

const StaffSearchPracticiansPage = () => {
  useTitle("Practitioners");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Practitioners</title>
        </Helmet>
      </HelmetProvider>
      <section className="search-practician">
        <PracticiansDirectory />
      </section>
    </>
  );
};

export default StaffSearchPracticiansPage;
