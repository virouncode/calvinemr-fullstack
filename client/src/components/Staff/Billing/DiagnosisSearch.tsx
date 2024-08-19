import React, { useState } from "react";
import { useDiagnosis } from "../../../hooks/reactquery/queries/diagnosisQueries";
import useIntersection from "../../../hooks/useIntersection";
import Input from "../../UI/Inputs/Input";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";

type DiagnosisSearchProps = {
  handleClickDiagnosis: (itemCode: number) => void;
};

const DiagnosisSearch = ({ handleClickDiagnosis }: DiagnosisSearchProps) => {
  const [search, setSearch] = useState("");
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useDiagnosis(search);

  const { ulRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const diagnosis = data?.pages.flatMap((page) => page.items);

  return (
    <div className="diagnosis__container">
      <div className="diagnosis-search">
        <Input
          value={search}
          onChange={handleSearch}
          id="diagnosis-search"
          label="Search"
          autoFocus={true}
          width={300}
        />
      </div>
      {error && <p className="diagnosis__err">{error.message}</p>}
      <ul className="diagnosis-results" ref={ulRef}>
        {!error && diagnosis && diagnosis.length > 0
          ? diagnosis.map((item, index) =>
              index === diagnosis.length - 1 ? (
                <li
                  className="diagnosis-results__item"
                  key={item.id}
                  onClick={() => handleClickDiagnosis(item.code)}
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
                  onClick={() => handleClickDiagnosis(item.code)}
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
