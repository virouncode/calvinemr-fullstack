import React from "react";
import { DoctorType } from "../../../../types/api";

type DoctorFaxNumberItemProps = {
  doctor: DoctorType;
  handleClickDoctor: (doctor: DoctorType) => void;
  lastItemRef?: (node: Element | null) => void;
};

const DoctorFaxNumberItem = ({
  doctor,
  handleClickDoctor,
  lastItemRef,
}: DoctorFaxNumberItemProps) => {
  return (
    <li
      className="fax-numbers__item"
      ref={lastItemRef}
      onClick={() => handleClickDoctor(doctor)}
    >
      {doctor.LastName ? `${doctor.LastName}, ` : ""}
      {doctor.FirstName ? `${doctor.FirstName}, ` : ""}
      {doctor.speciality}
    </li>
  );
};

export default DoctorFaxNumberItem;
