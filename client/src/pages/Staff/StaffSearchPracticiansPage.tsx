import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import PracticiansDirectory from "../../components/Staff/PracticiansDirectory/PracticiansDirectory";
import useTitle from "../../hooks/useTitle";

const StaffSearchPracticiansPage = () => {
  useTitle("Practicioners");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Practicioners</title>
        </Helmet>
      </HelmetProvider>
      <section className="search-practician">
        <PracticiansDirectory />
      </section>
    </>
  );
};

export default StaffSearchPracticiansPage;
