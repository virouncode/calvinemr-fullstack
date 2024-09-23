import { useMediaQuery } from "@mui/material";
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import PatientRecord from "../../components/Staff/Record/Sections/PatientRecord";
import ErrorParagraph from "../../components/UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../components/UI/Paragraphs/LoadingParagraph";
import { usePatient } from "../../hooks/reactquery/queries/patientsQueries";
import useTitle from "../../hooks/useTitle";
import { toPatientName } from "../../utils/names/toPatientName";
import PatientRecordMobile from "../../components/Staff/Record/Sections/PatientRecordMobile";

const StaffPatientRecordPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: demographicsInfos,
    isPending,
    error,
  } = usePatient(parseInt(id as string));
  useTitle("Patient Medical Record");

  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");

  if (isPending)
    return (
      <section className="patient-record">
        <LoadingParagraph />
      </section>
    );
  if (error)
    return (
      <section className="patient-record">
        <ErrorParagraph errorMsg={error.message} />
      </section>
    );
  return demographicsInfos ? (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`EMR: ${toPatientName(demographicsInfos)}`}</title>
        </Helmet>
      </HelmetProvider>
      <section className="patient-record">
        {isTabletOrMobile ? (
          <PatientRecordMobile
            demographicsInfos={demographicsInfos}
            patientId={parseInt(id as string)}
          />
        ) : (
          <PatientRecord
            demographicsInfos={demographicsInfos}
            patientId={parseInt(id as string)}
          />
        )}
      </section>
    </>
  ) : (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`EMR: Not found`}</title>
        </Helmet>
      </HelmetProvider>
      <section className="patient-record">
        <div className="missing-container">
          <h2 className="missing-container-title">Page not found</h2>
          <div>Unable to find the patient infos</div>
          <div className="missing-container-link" onClick={() => navigate(-1)}>
            Go back
          </div>
        </div>
      </section>
    </>
  );
};

export default StaffPatientRecordPage;
