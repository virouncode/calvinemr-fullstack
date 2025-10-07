import React, { useState } from "react";
import { useDoctorsSimpleSearch } from "../../../../hooks/reactquery/queries/doctorsQueries";
import useDebounce from "../../../../hooks/useDebounce";
import useIntersection from "../../../../hooks/useIntersection";
import Input from "../../../UI/Inputs/Input";
import EmptyLi from "../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../UI/Lists/LoadingLi";
import DoctorFaxNumberItem from "./DoctorFaxNumberItem";

type DoctorsFaxNumbersProps = {
  handleCheckContact: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isContactChecked: (faxNumber: string) => boolean;
};

const DoctorsFaxNumbers = ({
  handleCheckContact,
  isContactChecked,
}: DoctorsFaxNumbersProps) => {
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
  } = useDoctorsSimpleSearch(debouncedSearch);
  //Intersection observer
  const { rootRef, targetRef } = useIntersection<HTMLUListElement | null>(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const doctors = data?.pages
    ?.flatMap((page) => page.items)
    .filter(({ FaxNumber }) => FaxNumber.phoneNumber);

  return (
    <div className="fax-numbers">
      <label className="fax-numbers__title">Doctors</label>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <ul className="fax-numbers__list" ref={rootRef}>
        {error && <li>{error.message}</li>}
        {doctors && doctors.length > 0
          ? doctors.map((doctor, index) =>
              index === doctors.length - 1 ? (
                <DoctorFaxNumberItem
                  key={doctor.id}
                  doctor={doctor}
                  targetRef={targetRef}
                  handleCheckContact={handleCheckContact}
                  isContactChecked={isContactChecked}
                />
              ) : (
                <DoctorFaxNumberItem
                  key={doctor.id}
                  doctor={doctor}
                  handleCheckContact={handleCheckContact}
                  isContactChecked={isContactChecked}
                />
              )
            )
          : !isFetchingNextPage && !isPending && <EmptyLi text="No results" />}
        {(isPending || isFetchingNextPage) && <LoadingLi />}
      </ul>
    </div>
  );
};

export default DoctorsFaxNumbers;
