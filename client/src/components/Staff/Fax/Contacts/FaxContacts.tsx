import React from "react";
import {
  DoctorType,
  FaxContactType,
  PharmacyType,
} from "../../../../types/api";
import DoctorsFaxNumbers from "./DoctorsFaxNumbers";
import OthersFaxNumbers from "./OthersFaxNumbers";
import PharmaciesFaxNumbers from "./PharmaciesFaxNumbers";

type FaxContactsProps = {
  handleClickPharmacy: (pharmacy: PharmacyType) => void;
  handleClickDoctor: (doctor: DoctorType) => void;
  handleClickOther: (other: FaxContactType) => void;
};

const FaxContacts = ({
  handleClickPharmacy,
  handleClickDoctor,
  handleClickOther,
}: FaxContactsProps) => {
  return (
    <div>
      <PharmaciesFaxNumbers handleClickPharmacy={handleClickPharmacy} />
      <DoctorsFaxNumbers handleClickDoctor={handleClickDoctor} />
      <OthersFaxNumbers handleClickOther={handleClickOther} />
    </div>
  );
};

export default FaxContacts;
