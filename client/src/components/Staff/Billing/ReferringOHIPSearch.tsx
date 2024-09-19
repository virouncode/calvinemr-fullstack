import React, { useState } from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { useDoctorsSearch } from "../../../hooks/reactquery/queries/doctorsQueries";
import useIntersection from "../../../hooks/useIntersection";
import { DoctorType, StaffType } from "../../../types/api";
import Input from "../../UI/Inputs/Input";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";

type ReferringOHIPSearchProps = {
  handleClickRefOHIP: (item: StaffType | DoctorType) => void;
  doctorsIdToRemove?: number[];
};

const ReferringOHIPSearch = ({
  handleClickRefOHIP,
  doctorsIdToRemove = [],
}: ReferringOHIPSearchProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  const [search, setSearch] = useState("");
  const clinicDoctors = staffInfos
    .filter(({ account_status }) => account_status !== "Closed")
    .filter(({ title }) => title === "Doctor");
  //Queries
  const {
    data: doctors,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useDoctorsSearch(search);
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
      <div className="refohip__container">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  const externalDoctorsDatas = doctors?.pages
    ?.flatMap((page) => page.items)
    ?.filter(({ id }) => !doctorsIdToRemove?.includes(id));

  const filteredClinicDoctors = clinicDoctors.filter(
    (clinicDoctor) =>
      clinicDoctor.full_name?.includes(search) ||
      clinicDoctor.ohip_billing_nbr.includes(search)
  );

  return (
    <div className="refohip__container">
      <div className="refohip__search">
        <Input
          value={search}
          onChange={handleSearch}
          id="refohip-search"
          autoFocus={true}
          placeholder="Search by OHIP#, Name"
        />
      </div>
      <div className="refohip__results">
        <p className="refohip__results-title">External doctors</p>
        <ul ref={ulRef}>
          <li className="refohip__results-item refohip__results-item--headers">
            <span className="refohip__results-code">OHIP#</span>
            <span className="refohip__results-name">Name</span>
          </li>
          {externalDoctorsDatas && externalDoctorsDatas.length > 0
            ? externalDoctorsDatas.map((item, index) =>
                index === externalDoctorsDatas.length - 1 ? (
                  <li
                    className="refohip__results-item"
                    key={item.id}
                    onClick={() => handleClickRefOHIP(item)}
                    ref={lastItemRef}
                  >
                    <span className="refohip__results-code">
                      {item.ohip_billing_nbr}
                    </span>{" "}
                    <span className="refohip__results-name">
                      Dr. {item.FirstName} {item.LastName} (
                      {item.speciality || ""},{" "}
                      {item.Address?.Structured?.City || ""})
                    </span>
                  </li>
                ) : (
                  <li
                    className="refohip__results-item"
                    key={item.id}
                    onClick={() => handleClickRefOHIP(item)}
                  >
                    <span className="refohip__results-code">
                      {item.ohip_billing_nbr}
                    </span>{" "}
                    <span className="refohip__results-name">
                      Dr. {item.FirstName} {item.LastName} (
                      {item.speciality || ""},{" "}
                      {item.Address?.Structured?.City || ""})
                    </span>
                  </li>
                )
              )
            : !isFetchingNextPage &&
              !isPending && (
                <EmptyLi text="No corresponding external doctors" />
              )}
          {(isFetchingNextPage || isPending) && <LoadingLi />}
        </ul>
      </div>
      <div className="refohip__results">
        <p className="refohip__results-title">Clinic doctors</p>
        <ul>
          <li className="refohip__results-item refohip__results-item--headers">
            <span className="refohip__results-code">OHIP#</span>
            <span className="refohip__results-name">Name</span>
          </li>
          {filteredClinicDoctors.length > 0 ? (
            filteredClinicDoctors.map((item) => (
              <li
                className="refohip__results-item"
                key={item.id}
                onClick={() => handleClickRefOHIP(item)}
              >
                <span className="refohip__results-code">
                  {item.ohip_billing_nbr}
                </span>{" "}
                <span className="refohip__results-name">
                  Dr. {item.first_name} {item.last_name} ({item.speciality})
                </span>
              </li>
            ))
          ) : (
            <EmptyLi text="No corresponding clinic doctors" />
          )}
        </ul>
      </div>
    </div>
  );
};

export default ReferringOHIPSearch;
