import { Helmet, HelmetProvider } from "react-helmet-async";
import { useParams } from "react-router-dom";
import PatientRecord from "../../components/Staff/Record/Sections/PatientRecord";
import { usePatient } from "../../hooks/reactquery/queries/patientsQueries";
import useTitle from "../../hooks/useTitle";
import { toPatientName } from "../../utils/names/toPatientName";

const StaffPatientRecordPage = () => {
  const { id } = useParams();
  const {
    data: demographicsInfos,
    isPending,
    error,
  } = usePatient(parseInt(id));

  useTitle("Patient Medical Record");
  return (
    demographicsInfos && (
      <>
        <HelmetProvider>
          <Helmet>
            <title>{`EMR: ${toPatientName(demographicsInfos)}`}</title>
          </Helmet>
        </HelmetProvider>
        <section className="patient-record-section">
          <PatientRecord
            demographicsInfos={demographicsInfos}
            loadingPatient={isPending}
            errPatient={error}
            patientId={parseInt(id)}
          />
        </section>
      </>
    )
  );
};

export default StaffPatientRecordPage;
