import { useState } from "react";
import { useDiagnosis } from "../../../hooks/reactquery/queries/diagnosisQueries";
import useIntersection from "../../../hooks/useIntersection";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";

const DiagnosisSearch = ({ handleClickDiagnosis }) => {
  const [search, setSearch] = useState("");
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useDiagnosis(search);

  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const diagnosis = data?.pages.flatMap((page) => page.items);

  return (
    <div className="diagnosis__container" ref={rootRef}>
      <div className="diagnosis-search">
        <label htmlFor="diagnosis-search">Search</label>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Name, Category..."
          id="diagnosis-search"
          autoComplete="off"
          autoFocus
        />
      </div>
      {error && <p className="diagnosis__err">{error.message}</p>}
      <ul className="diagnosis-results">
        {!error && data && diagnosis.length > 0
          ? diagnosis.map((item, index) =>
              index === diagnosis.length - 1 ? (
                <li
                  className="diagnosis-results__item"
                  key={item.id}
                  onClick={(e) => handleClickDiagnosis(e, item.code)}
                  ref={lastItemRef}
                >
                  <span className="diagnosis-results__code">{item.code}</span>{" "}
                  <span className="diagnosis-results__name">
                    {item.diagnosis}, {item.category}
                  </span>
                </li>
              ) : (
                <li
                  className="diagnosis-results__item"
                  key={item.id}
                  onClick={(e) => handleClickDiagnosis(e, item.code)}
                >
                  <span className="diagnosis-results__code">{item.code}</span>{" "}
                  <span className="diagnosis-results__name">
                    {item.diagnosis}, {item.category}
                  </span>
                </li>
              )
            )
          : !isFetchingNextPage &&
            !isPending && <EmptyLi text="No corresponding diagnosis" />}
        {(isFetchingNextPage || isPending) && <LoadingLi />}
      </ul>
    </div>
  );
};

export default DiagnosisSearch;
