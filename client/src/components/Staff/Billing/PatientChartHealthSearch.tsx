import React, { useState } from "react";
import { usePatientsSimpleSearch } from "../../../hooks/reactquery/queries/patientsQueries";
import useDebounce from "../../../hooks/useDebounce";
import useIntersection from "../../../hooks/useIntersection";
import { DemographicsType } from "../../../types/api";
import { toPatientName } from "../../../utils/names/toPatientName";
import Input from "../../UI/Inputs/Input";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";

type PatientChartHealthSearchProps = {
  handleClickPatient: (item: DemographicsType) => void;
  patientsIdToRemove?: number[];
};

const PatientChartHealthSearch = ({
  handleClickPatient,
  patientsIdToRemove = [],
}: PatientChartHealthSearchProps) => {
  //Hooks
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  //Queries
  const {
    data: patients,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = usePatientsSimpleSearch(debouncedSearch);
  //Intersection observer
  const { rootRef, targetRef } = useIntersection<HTMLUListElement | null>(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <div className="hcn__search">
        <Input
          value={search}
          onChange={handleSearch}
          id="search"
          autoFocus={true}
          placeholder="Search by Chart#, Health Card#, Name..."
        />
      </div>
      <ul className="hcn__results" ref={rootRef}>
        <li className="hcn__results-item hcn__results-item--headers">
          <span className="hcn__results-code">Chart#</span>
          <span className="hcn__results-code">Health Card#</span>
          <span className="hcn__results-name">Name</span>
        </li>
        {patientsDatas && patientsDatas.length > 0
          ? patientsDatas.map((item, index) =>
              index === patientsDatas.length - 1 ? (
                <li
                  className="hcn__results-item"
                  key={item.id}
                  onClick={() => handleClickPatient(item)}
                  ref={targetRef}
                >
                  <span className="hcn__results-code">{item.ChartNumber}</span>{" "}
                  <span className="hcn__results-code">
                    {item.HealthCard?.Number}
                  </span>{" "}
                  <span className="hcn__results-name">
                    {toPatientName(item)}
                  </span>
                </li>
              ) : (
                <li
                  className="hcn__results-item"
                  key={item.id}
                  onClick={() => handleClickPatient(item)}
                >
                  <span className="hcn__results-code">{item.ChartNumber}</span>{" "}
                  <span className="hcn__results-code">
                    {item.HealthCard?.Number}
                  </span>{" "}
                  <span className="hcn__results-name">
                    {toPatientName(item)}
                  </span>
                </li>
              )
            )
          : !isFetchingNextPage &&
            !isPending && <EmptyLi text="No corresponding patients" />}
        {(isFetchingNextPage || isPending) && <LoadingLi />}
      </ul>
    </div>
  );
};

export default PatientChartHealthSearch;
