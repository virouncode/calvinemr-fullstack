import { Helmet, HelmetProvider } from "react-helmet-async";
import PatientSearch from "../../components/Staff/Record/Search/PatientSearch";
import useTitle from "../../hooks/useTitle";

const StaffSearchPatientPage = () => {
  useTitle("Search Patient");
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Patients</title>
        </Helmet>
      </HelmetProvider>
      <section className="search-patient-section">
        <PatientSearch />
      </section>
    </>
  );
};

export default StaffSearchPatientPage;
