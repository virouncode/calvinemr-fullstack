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
  handleClickRefOHIP: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    item: StaffType | DoctorType
  ) => void;
  doctorsIdToRemove?: number[];
};

const ReferringOHIPSearch = ({
  handleClickRefOHIP,
  doctorsIdToRemove = [],
}: ReferringOHIPSearchProps) => {
  const [search, setSearch] = useState("");
  const {
    data: doctors,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useDoctorsSearch(search);
  const { ulRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );
  const { staffInfos } = useStaffInfosContext();
  const clinicDoctors = staffInfos
    .filter(({ account_status }) => account_status !== "Closed")
    .filter(({ title }) => title === "Doctor");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  if (error)
    return (
      <div className="refohip__container">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  const doctorsDatas = doctors?.pages
    ?.flatMap((page) => page.items)
    ?.filter(({ id }) => !doctorsIdToRemove?.includes(id));

  return (
    <div className="refohip__container">
      <div className="refohip-search">
        <Input
          value={search}
          onChange={handleSearch}
          id="refohip-search"
          label="Search"
          autoFocus={true}
          placeholder="OHIP#, Name"
          width={300}
        />
      </div>
      <p
        style={{
          padding: 0,
          marginBottom: "5px",
          fontWeight: "bold",
        }}
      >
        External doctors
      </p>
      <ul className="refohip-results" ref={ulRef}>
        {isPending ? (
          <LoadingLi paddingLateral={20} />
        ) : doctorsDatas && doctorsDatas.length > 0 ? (
          <>
            <li className="refohip-results__item refohip-results__item--headers">
              <span className="refohip-results__code">OHIP#</span>{" "}
              <span
                className="refohip-results__name"
                style={{ fontWeight: "bold" }}
              >
                Name
              </span>
            </li>
            {doctorsDatas.map((item, index) =>
              index === doctorsDatas.length - 1 ? (
                <li
                  className="refohip-results__item"
                  key={item.id}
                  onClick={(e) => handleClickRefOHIP(e, item)}
                  ref={lastItemRef}
                >
                  <span className="refohip-results__code">
                    {item.ohip_billing_nbr}
                  </span>{" "}
                  <span className="refohip-results__name">
                    Dr. {item.FirstName} {item.LastName} (
                    {item.speciality || ""},{" "}
                    {item.Address?.Structured?.City || ""})
                  </span>
                </li>
              ) : (
                <li
                  className="refohip-results__item"
                  key={item.id}
                  onClick={(e) => handleClickRefOHIP(e, item)}
                >
                  <span className="refohip-results__code">
                    {item.ohip_billing_nbr}
                  </span>{" "}
                  <span className="refohip-results__name">
                    Dr. {item.FirstName} {item.LastName} (
                    {item.speciality || ""},{" "}
                    {item.Address?.Structured?.City || ""})
                  </span>
                </li>
              )
            )}
          </>
        ) : (
          !isFetchingNextPage && (
            <EmptyLi paddingLateral={20} text="No external doctors" />
          )
        )}
        {isFetchingNextPage && <LoadingLi paddingLateral={20} />}
      </ul>
      <p
        style={{
          padding: 0,
          marginBottom: "5px",
          fontWeight: "bold",
          marginTop: "20px",
        }}
      >
        Clinic doctors
      </p>
      <ul className="refohip-results">
        <li className="refohip-results__item refohip-results__item--headers">
          <span className="refohip-results__code">OHIP#</span>{" "}
          <span
            className="refohip-results__name"
            style={{ fontWeight: "bold" }}
          >
            Name
          </span>
        </li>
        {clinicDoctors
          .filter(
            (clinicDoctor) =>
              clinicDoctor.full_name?.includes(search) ||
              clinicDoctor.ohip_billing_nbr.includes(search)
          )
          .map((item) => (
            <li
              className="refohip-results__item"
              key={item.id}
              onClick={(e) => handleClickRefOHIP(e, item)}
            >
              <span className="refohip-results__code">
                {item.ohip_billing_nbr}
              </span>{" "}
              <span className="refohip-results__name">
                Dr. {item.first_name} {item.last_name} ({item.speciality})
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ReferringOHIPSearch;
