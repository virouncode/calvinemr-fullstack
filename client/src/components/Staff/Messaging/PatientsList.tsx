import React from "react";
import { usePatientsSimpleSearch } from "../../../hooks/reactquery/queries/patientsQueries";
import useIntersection from "../../../hooks/useIntersection";
import { DemographicsType } from "../../../types/api";
import { toPatientName } from "../../../utils/names/toPatientName";
import Checkbox from "../../UI/Checkbox/Checkbox";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";
import PatientsListItem from "./PatientsListItem";

type PatientsListProps = {
  isPatientChecked: (id: number) => boolean;
  handleCheckPatient: (
    e: React.ChangeEvent<HTMLInputElement>,
    patient: DemographicsType
  ) => void;
  search: string;
  allAvailable?: boolean;
  allPatientsChecked?: boolean;
  handleCheckAllPatients?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PatientsList = ({
  isPatientChecked,
  handleCheckPatient,
  search,
  allAvailable = false,
  allPatientsChecked,
  handleCheckAllPatients,
}: PatientsListProps) => {
  //Queries
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = usePatientsSimpleSearch(search);
  //Intersection observer
  const { ulRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const patientsDemographics = data?.pages?.flatMap((page) => page.items);

  return (
    <ul className="patients__list" ref={ulRef}>
      {error && <li>{error.message}</li>}
      {isPending ? (
        <LoadingLi />
      ) : !error && patientsDemographics && patientsDemographics.length > 0 ? (
        <>
          {allAvailable && (
            <li className="patients__list-item">
              <Checkbox
                id="all-patients"
                onChange={
                  handleCheckAllPatients as (
                    e: React.ChangeEvent<HTMLInputElement>
                  ) => void
                }
                checked={allPatientsChecked as boolean}
                label="All"
              />
            </li>
          )}
          {patientsDemographics.map((info, index) =>
            index === patientsDemographics.length - 1 ? (
              <PatientsListItem
                info={info}
                key={info.id}
                handleCheckPatient={handleCheckPatient}
                isPatientChecked={isPatientChecked}
                patientName={toPatientName(info)}
                progress={isFetchingNextPage}
                lastItemRef={lastItemRef}
              />
            ) : (
              <PatientsListItem
                info={info}
                key={info.id}
                handleCheckPatient={handleCheckPatient}
                isPatientChecked={isPatientChecked}
                patientName={toPatientName(info)}
                progress={isFetchingNextPage}
              />
            )
          )}
        </>
      ) : (
        !isFetchingNextPage && <EmptyLi text="No patients found" />
      )}
      {isFetchingNextPage && <LoadingLi />}
    </ul>
  );
};

export default PatientsList;
