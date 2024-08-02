import { Helmet, HelmetProvider } from "react-helmet-async";
import PatientPamphlets from "../../components/Patient/Pamphlets/PatientPamphlets";
import useTitle from "../../hooks/useTitle";

const PatientPamphletsPage = () => {
  useTitle("Pamphlets");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Pamphlets</title>
        </Helmet>
      </HelmetProvider>
      <section className="patient-pamphlets-section">
        <PatientPamphlets />
      </section>
    </>
  );
};

export default PatientPamphletsPage;
