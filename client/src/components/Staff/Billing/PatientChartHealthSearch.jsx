import { useState } from "react";
import { usePatientsSimpleSearch } from "../../../hooks/reactquery/queries/patientsQueries";
import useIntersection from "../../../hooks/useIntersection";
import { toPatientName } from "../../../utils/names/toPatientName";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";

const PatientChartHealthSearch = ({
  handleClickPatient,
  patientsIdToRemove = null,
}) => {
  const [search, setSearch] = useState("");

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

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  if (error)
    return (
      <div className="hcn__container">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  const patientsDatas = patients?.pages
    ?.flatMap((page) => page.items)
    ?.filter(({ patient_id }) => !patientsIdToRemove?.includes(patient_id));

  return (
    <div className="hcn__container">
      <div className="hcn-search">
        <label htmlFor="hcn-search">Search</label>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Chart#, Health Card#, Name..."
          style={{ width: "300px" }}
          id="hcn-search"
          autoComplete="off"
          autoFocus
        />
      </div>
      <ul className="hcn-results" ref={rootRef}>
        {isPending ? (
          <LoadingLi />
        ) : patientsDatas && patientsDatas.length > 0 ? (
          <>
            <li className="hcn-results__item hcn-results__item--headers">
              <span className="hcn-results__code">Chart#</span>
              <span className="hcn-results__code">Health Card#</span>
              <span
                className="hcn-results__name"
                style={{ fontWeight: "bold" }}
              >
                Name
              </span>
            </li>
            {patientsDatas.map((item, index) =>
              index === patientsDatas.length - 1 ? (
                <li
                  className="hcn-results__item"
                  key={item.id}
                  onClick={(e) => handleClickPatient(e, item)}
                  ref={lastItemRef}
                >
                  <span className="hcn-results__code">{item.ChartNumber}</span>{" "}
                  <span className="hcn-results__code">
                    {item.HealthCard?.Number}
                  </span>{" "}
                  <span className="hcn-results__name">
                    {toPatientName(item)}
                  </span>
                </li>
              ) : (
                <li
                  className="hcn-results__item"
                  key={item.id}
                  onClick={(e) => handleClickPatient(e, item)}
                >
                  <span className="hcn-results__code">{item.ChartNumber}</span>{" "}
                  <span className="hcn-results__code">
                    {item.HealthCard?.Number}
                  </span>{" "}
                  <span className="hcn-results__name">
                    {toPatientName(item)}
                  </span>
                </li>
              )
            )}
          </>
        ) : (
          !isFetchingNextPage && <EmptyLi text="No corresponding patients" />
        )}
        {isFetchingNextPage && <LoadingLi />}
      </ul>
    </div>
  );
};

export default PatientChartHealthSearch;
