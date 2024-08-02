import { useState } from "react";
import { usePatientsSimpleSearch } from "../../../../../hooks/reactquery/queries/patientsQueries";
import useIntersection from "../../../../../hooks/useIntersection";
import { isObjectEmpty } from "../../../../../utils/js/isObjectEmpty";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import EmptyLi from "../../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";

const RelationshipPatientsSelect = ({
  formDatas,
  setFormDatas,
  patientId = 0,
}) => {
  //PATIENTS DATAS
  const [search, setSearch] = useState(
    isObjectEmpty(formDatas.relation_infos)
      ? ""
      : toPatientName(formDatas.relation_infos)
  );

  const {
    data: patients,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = usePatientsSimpleSearch(search);

  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const [resultsVisible, setResultsVisible] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setResultsVisible(true);
  };

  const handleSelect = (e, relationInfos) => {
    setFormDatas({
      ...formDatas,
      relation_infos: relationInfos,
    });
    setSearch(toPatientName(relationInfos));
    setResultsVisible(false);
  };

  if (error)
    return (
      <div>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  const patientsList = patients?.pages
    ?.flatMap((page) => page.items)
    ?.filter(({ patient_id }) => patient_id !== patientId);

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        onClick={() => setResultsVisible(true)}
        className="patients-select__search"
        placeholder="Search by name, health card..."
        autoComplete="off"
      />
      {resultsVisible && (
        <ul ref={rootRef} className="patients-select__results">
          {isPending && <LoadingLi />}
          {patientsList && patientsList.length > 0
            ? patientsList.map((item, index) =>
                index === patientsList.length - 1 ? (
                  <li
                    className="patients-select__results-item"
                    key={item.patient_id}
                    ref={lastItemRef}
                    onClick={(e) => handleSelect(e, item)}
                  >
                    {toPatientName(item)}
                  </li>
                ) : (
                  <li
                    key={item.patient_id}
                    className="patients-select__results-item"
                    onClick={(e) => handleSelect(e, item)}
                  >
                    {toPatientName(item)}
                  </li>
                )
              )
            : !isFetchingNextPage &&
              !isPending && <EmptyLi text="No corresponding patient" />}
          {isFetchingNextPage && <LoadingLi />}
        </ul>
      )}
    </div>
  );
};

export default RelationshipPatientsSelect;
