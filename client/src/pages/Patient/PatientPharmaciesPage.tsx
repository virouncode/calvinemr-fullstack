import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import PatientPharmacies from "../../components/Patient/Pharmacies/PatientPharmacies";
import useTitle from "../../hooks/useTitle";

const PatientPharmaciesPage = () => {
  useTitle("Pharmacies");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Pharmacies</title>
        </Helmet>
      </HelmetProvider>
      <section className="patient-pharmacies-section">
        <PatientPharmacies />
      </section>
    </>
  );
};

export default PatientPharmaciesPage;
