import { usePatientsSimpleSearch } from "../../../hooks/reactquery/queries/patientsQueries";
import useIntersection from "../../../hooks/useIntersection";
import { toPatientName } from "../../../utils/names/toPatientName";
import Checkbox from "../../UI/Checkbox/Checkbox";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";
import PatientsListItem from "./PatientsListItem";

const PatientsList = ({
  isPatientChecked,
  handleCheckPatient,
  search,
  allAvailable,
  allPatientsChecked,
  handleCheckAllPatients,
}) => {
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = usePatientsSimpleSearch(search);

  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const patientsDemographics = data?.pages?.flatMap((page) => page.items);

  return (
    <ul className="patients__list" ref={rootRef}>
      {error && <li>{error.message}</li>}
      {isPending ? (
        <LoadingLi />
      ) : !error && patientsDemographics && patientsDemographics.length > 0 ? (
        <>
          {allAvailable && (
            <li className="patients__list-item">
              <Checkbox
                id="all-patients"
                onChange={handleCheckAllPatients}
                checked={allPatientsChecked}
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
                lastItemRef={lastItemRef}
                allPatientsChecked={allPatientsChecked}
              />
            ) : (
              <PatientsListItem
                info={info}
                key={info.id}
                handleCheckPatient={handleCheckPatient}
                isPatientChecked={isPatientChecked}
                patientName={toPatientName(info)}
                allPatientsChecked={allPatientsChecked}
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
