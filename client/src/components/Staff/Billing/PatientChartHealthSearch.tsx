import React, { useState } from "react";
import { usePatientsSimpleSearch } from "../../../hooks/reactquery/queries/patientsQueries";
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
  //Queries
  const {
    data: patients,
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
          label="Search"
          autoFocus={true}
          placeholder="Chart#, Health Card#, Name..."
        />
      </div>
      <ul className="hcn__results" ref={ulRef}>
        {isPending ? (
          <LoadingLi />
        ) : patientsDatas && patientsDatas.length > 0 ? (
          <>
            <li className="hcn__results-item hcn__results-item--headers">
              <span className="hcn__results-code">Chart#</span>
              <span className="hcn__results-code">Health Card#</span>
              <span className="hcn__results-name">Name</span>
            </li>
            {patientsDatas.map((item, index) =>
              index === patientsDatas.length - 1 ? (
                <li
                  className="hcn__results-item"
                  key={item.id}
                  onClick={() => handleClickPatient(item)}
                  ref={lastItemRef}
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
