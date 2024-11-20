import React, { useState } from "react";
import { useDiagnosis } from "../../../hooks/reactquery/queries/diagnosisQueries";
import useDebounce from "../../../hooks/useDebounce";
import useIntersection from "../../../hooks/useIntersection";
import Input from "../../UI/Inputs/Input";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";

type DiagnosisSearchProps = {
  handleClickDiagnosis: (itemCode: number) => void;
};

const DiagnosisSearch = ({ handleClickDiagnosis }: DiagnosisSearchProps) => {
  //Hooks
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  //Queries
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useDiagnosis(debouncedSearch);
  //Intersection observer
  const { ulRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
    "ul"
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  if (error)
    return (
      <div className="diagnosis__container">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  const diagnosis = data?.pages.flatMap((page) => page.items);

  return (
    <div className="diagnosis__container">
      <div className="diagnosis__search">
        <Input
          value={search}
          onChange={handleSearch}
          id="diagnosis-search"
          autoFocus={true}
          placeholder="Search by Diagnosis name..."
        />
      </div>
      <ul className="diagnosis__results" ref={ulRef}>
        <li className="diagnosis__results-item diagnosis__results-item--headers">
          <span className="diagnosis__results-code">Code</span>
          <span className="diagnosis__results-diagnosis">Diagnosis</span>
        </li>

        {diagnosis && diagnosis.length > 0
          ? diagnosis.map((item, index) =>
              index === diagnosis.length - 1 ? (
                <li
                  className="diagnosis__results-item"
                  key={item.id}
                  onClick={() => handleClickDiagnosis(item.code)}
                  ref={lastItemRef}
                >
                  <span className="diagnosis__results-code">{item.code}</span>
                  <span className="diagnosis__results-diagnosis">
                    {item.diagnosis}, {item.category}
                  </span>
                </li>
              ) : (
                <li
                  className="diagnosis__results-item"
                  key={item.id}
                  onClick={() => handleClickDiagnosis(item.code)}
                >
                  <span className="diagnosis__results-code">{item.code}</span>
                  <span className="diagnosis__results-diagnosis">
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
