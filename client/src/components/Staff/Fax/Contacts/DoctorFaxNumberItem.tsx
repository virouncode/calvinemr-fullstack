import React from "react";
import { DoctorType } from "../../../../types/api";
import Checkbox from "../../../UI/Checkbox/Checkbox";

type DoctorFaxNumberItemProps = {
  doctor: DoctorType;
  handleCheckContact: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isContactChecked: (faxNumber: string) => boolean;
  targetRef?: (node: Element | null) => void;
};

const DoctorFaxNumberItem = ({
  doctor,
  handleCheckContact,
  isContactChecked,
  targetRef,
}: DoctorFaxNumberItemProps) => {
  const label = `${doctor.LastName ? `${doctor.LastName} ` : ""}${
    doctor.FirstName ? `${doctor.FirstName}, ` : ""
  }${doctor.speciality ? `${doctor.speciality}, ` : ""}${
    doctor.Address.Structured.City
  }`;
  return (
    <li className="fax-numbers__item" ref={targetRef}>
      <Checkbox
        id={doctor.FaxNumber.phoneNumber}
        name={doctor.LastName}
        onChange={handleCheckContact}
        checked={isContactChecked(doctor.FaxNumber.phoneNumber)}
        label={label}
      />
    </li>
  );
};

export default DoctorFaxNumberItem;
