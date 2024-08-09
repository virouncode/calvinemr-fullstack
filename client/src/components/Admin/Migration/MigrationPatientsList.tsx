import React from "react";
import { usePatients } from "../../../hooks/reactquery/queries/patientsQueries";
import useIntersection from "../../../hooks/useIntersection";
import { DemographicsType } from "../../../types/api";
import { toPatientName } from "../../../utils/names/toPatientName";
import PatientsListItem from "../../Staff/Messaging/PatientsListItem";
import Checkbox from "../../UI/Checkbox/Checkbox";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";

const MigrationPatientsList = ({
  isPatientChecked,
  handleCheckPatient,
  handleCheckAllPatients,
  isAllPatientsChecked,
  progress,
  search,
}) => {
  const {
    data,
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
  const patientsDemographics: DemographicsType[] = data?.pages?.flatMap(
    (page) => page.items
  );

  return (
    <ul className="migration-export__patients-list" ref={rootRef}>
      <li className="patients__list-item">
        <Checkbox
          id="all-patients"
          name="all-patients"
          onChange={handleCheckAllPatients}
          checked={isAllPatientsChecked()}
          disabled={progress}
          label="All"
        />
      </li>
      {patientsDemographics && patientsDemographics.length > 0
        ? patientsDemographics.map((item, index) =>
            index === patientsDemographics.length - 1 ? (
              <PatientsListItem
                info={item}
                key={item.id}
                handleCheckPatient={handleCheckPatient}
                isPatientChecked={isPatientChecked}
                patientName={toPatientName(item)}
                progress={progress}
                lastItemRef={lastItemRef}
              />
            ) : (
              <PatientsListItem
                info={item}
                key={item.id}
                handleCheckPatient={handleCheckPatient}
                isPatientChecked={isPatientChecked}
                patientName={toPatientName(item)}
                progress={progress}
              />
            )
          )
        : !isFetchingNextPage && <EmptyLi text="No corresponding patients" />}
      {isFetchingNextPage && <LoadingLi />}
    </ul>
  );
};

export default MigrationPatientsList;
