import React from "react";
import { useDoctors } from "../../../../hooks/reactquery/queries/doctorsQueries";
import useIntersection from "../../../../hooks/useIntersection";
import { DoctorType } from "../../../../types/api";
import LoadingLi from "../../../UI/Lists/LoadingLi";
import DoctorFaxNumberItem from "./DoctorFaxNumberItem";

type DoctorsFaxNumbersProps = {
  handleClickDoctor: (doctor: DoctorType) => void;
};

const DoctorsFaxNumbers = ({ handleClickDoctor }: DoctorsFaxNumbersProps) => {
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useDoctors();

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
              handleClickDoctor={handleClickDoctor}
            />
          ) : (
            <DoctorFaxNumberItem
              key={doctor.id}
              doctor={doctor}
              handleClickDoctor={handleClickDoctor}
            />
          )
        )}
      </ul>
    </div>
  );
};

export default DoctorsFaxNumbers;
