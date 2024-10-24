import React from "react";
import { useDoctors } from "../../../../hooks/reactquery/queries/doctorsQueries";
import useIntersection from "../../../../hooks/useIntersection";
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
  //Queries
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useDoctors();
  //Intersection observer
  const { ulRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  if (isPending)
    return (
      <div className="fax-numbers">
        <label className="fax-numbers__title">Doctors</label>
        <ul className="fax-numbers__list">
          <LoadingLi />
        </ul>
      </div>
    );
  if (error)
    return (
      <div className="fax-numbers">
        <label className="fax-numbers__title">Doctors</label>
        <ul className="fax-numbers__list">
          <li>{error.message}</li>
        </ul>
      </div>
    );

  const doctors = data.pages
    ?.flatMap((page) => page.items)
    .filter(({ FaxNumber }) => FaxNumber.phoneNumber);

  return (
    <div className="fax-numbers">
      <label className="fax-numbers__title">Doctors</label>
      <ul className="fax-numbers__list" ref={ulRef}>
        {doctors.map((doctor, index) =>
          index === doctors.length - 1 ? (
            <DoctorFaxNumberItem
              key={doctor.id}
              doctor={doctor}
              lastItemRef={lastItemRef}
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
        )}
      </ul>
    </div>
  );
};

export default DoctorsFaxNumbers;
