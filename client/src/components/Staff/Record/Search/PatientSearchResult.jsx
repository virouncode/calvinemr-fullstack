import { usePatients } from "../../../../hooks/reactquery/queries/patientsQueries";
import useIntersection from "../../../../hooks/useIntersection";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import LoadingRow from "../../../UI/Tables/LoadingRow";
import PatientResultItem from "./PatientResultItem";

const PatientSearchResult = ({ search }) => {
  const {
    data: patients,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = usePatients(search);

  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;

  const patientsDatas = patients.pages.flatMap((page) => page.items);

  return (
    patients && (
      <>
        <div className="patient-result__summary">
          Number of patients: {patients.pages[0].itemsTotal}
        </div>
        <div className="patient-result__table-container" ref={rootRef}>
          <table className="patient-result__table">
            <thead>
              <tr>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Date of birth</th>
                <th>Age</th>
                <th>Chart#</th>
                <th>Email</th>
                <th>Cell phone</th>
                <th>Home phone</th>
                <th>Work phone</th>
                <th>Health Card#</th>
                <th>Address</th>
                <th>Postal/Zip Code</th>
                <th>Province/State</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {patientsDatas.map((patient, index) =>
                index === patientsDatas.length - 1 ? (
                  <PatientResultItem
                    patient={patient}
                    key={patient.id}
                    lastPatientRef={lastItemRef}
                  />
                ) : (
                  <PatientResultItem patient={patient} key={patient.id} />
                )
              )}
              {isFetchingNextPage && <LoadingRow colSpan="15" />}
            </tbody>
          </table>
        </div>
      </>
    )
  );
};

export default PatientSearchResult;
