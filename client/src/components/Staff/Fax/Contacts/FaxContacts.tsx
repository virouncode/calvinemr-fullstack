import React from "react";
import {
  DoctorType,
  FaxContactType,
  PharmacyType,
} from "../../../../types/api";
import XmarkRectangleIcon from "../../../UI/Icons/XmarkRectangleIcon";
import DoctorsFaxNumbers from "./DoctorsFaxNumbers";
import OthersFaxNumbers from "./OthersFaxNumbers";
import PharmaciesFaxNumbers from "./PharmaciesFaxNumbers";

type FaxContactsProps = {
  handleClickPharmacy: (pharmacy: PharmacyType) => void;
  handleClickDoctor: (doctor: DoctorType) => void;
  handleClickOther: (other: FaxContactType) => void;
  closeCross?: boolean;
  recipientsRef?: React.MutableRefObject<HTMLDivElement | null>;
};

const FaxContacts = ({
  handleClickPharmacy,
  handleClickDoctor,
  handleClickOther,
  closeCross,
  recipientsRef,
}: FaxContactsProps) => {
  const handleClose = () => {
    if (recipientsRef?.current)
      recipientsRef.current.style.transform = "translateX(-200%)";
  };
  return (
    <div className="fax-contacts">
      <div className="fax-contacts__title">
        Recipients{" "}
        {closeCross && (
          <XmarkRectangleIcon color=" #3d375a" onClick={handleClose} />
        )}
      </div>
      <PharmaciesFaxNumbers handleClickPharmacy={handleClickPharmacy} />
      <DoctorsFaxNumbers handleClickDoctor={handleClickDoctor} />
      <OthersFaxNumbers handleClickOther={handleClickOther} />
    </div>
  );
};

export default FaxContacts;
