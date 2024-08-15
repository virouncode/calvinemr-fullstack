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
  handleClickPatient: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    item: DemographicsType
  ) => void;
  patientsIdToRemove?: number[];
};

const PatientChartHealthSearch = ({
  handleClickPatient,
  patientsIdToRemove = [],
}: PatientChartHealthSearchProps) => {
  const [search, setSearch] = useState("");

  const {
    data: patients,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = usePatientsSimpleSearch(search);

  const { ulRef, lastItemRef } = useIntersection(
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
        <Input
          value={search}
          onChange={handleSearch}
          id="search"
          label="Search"
          autoFocus={true}
          placeholder="Chart#, Health Card#, Name..."
          width={300}
        />
      </div>
      <ul className="hcn-results" ref={ulRef}>
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
