import React from "react";
import { useNavigate } from "react-router-dom";
import useUserContext from "../../../../hooks/context/useUserContext";
import { usePatients } from "../../../../hooks/reactquery/queries/patientsQueries";
import useIntersection from "../../../../hooks/useIntersection";
import {
  SearchPatientType,
  UserAdminType,
  UserStaffType,
} from "../../../../types/app";
import Button from "../../../UI/Buttons/Button";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import LoadingRow from "../../../UI/Tables/LoadingRow";
import PatientResultItem from "./PatientResultItem";

type PatientSearchResultProps = {
  debouncedSearch: SearchPatientType;
};

const PatientSearchResult = ({ debouncedSearch }: PatientSearchResultProps) => {
  const { user } = useUserContext() as { user: UserStaffType | UserAdminType };
  //Queries
  const {
    data: patients,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = usePatients(debouncedSearch);
  //Intersection observer
  const { divRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );
  const navigate = useNavigate();

  const handleClickNewPatient = () => {
    navigate("/staff/signup-patient");
  };
  const handleClickPatientsGroups = () => {
    navigate("/staff/groups");
  };

  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;

  const patientsDatas = patients.pages.flatMap((page) => page.items);

  return (
    patients && (
      <>
        <div className="search-patient__count">
          <div className="search-patient__btn-container">
            <Button label="New Patient" onClick={handleClickNewPatient} />
            <Button
              label="Patients groups"
              onClick={handleClickPatientsGroups}
            />
          </div>
          <p>
            <em>Number of patients: {patients.pages[0].itemsTotal}</em>
          </p>
        </div>
        <div className="search-patient__table-container" ref={divRef}>
          <table
            className={
              user.access_level === "admin"
                ? "search-patient__table search-patient__table--admin"
                : "search-patient__table"
            }
          >
            <thead>
              <tr>
                {user.access_level === "admin" && <th>Action</th>}
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
