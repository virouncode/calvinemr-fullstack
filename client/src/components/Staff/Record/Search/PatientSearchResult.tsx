import React from "react";
import { usePatients } from "../../../../hooks/reactquery/queries/patientsQueries";
import useIntersection from "../../../../hooks/useIntersection";
import { SearchPatientType } from "../../../../types/app";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import LoadingRow from "../../../UI/Tables/LoadingRow";
import PatientResultItem from "./PatientResultItem";

type PatientSearchResultProps = {
  search: SearchPatientType;
};

const PatientSearchResult = ({ search }: PatientSearchResultProps) => {
  //Queries
  const {
    data: patients,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = usePatients(search);
  //Intersection observer
  const { divRef, lastItemRef } = useIntersection(
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
        <div className="search-patient__count">
          <em>Number of patients: {patients.pages[0].itemsTotal}</em>
        </div>
        <div className="search-patient__table-container" ref={divRef}>
          <table className="search-patient__table">
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
              {isFetchingNextPage && <LoadingRow colSpan={15} />}
            </tbody>
          </table>
        </div>
      </>
    )
  );
};

export default PatientSearchResult;
