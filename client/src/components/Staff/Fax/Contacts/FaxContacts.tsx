import React from "react";
import XmarkRectangleIcon from "../../../UI/Icons/XmarkRectangleIcon";
import DoctorsFaxNumbers from "./DoctorsFaxNumbers";
import OthersFaxNumbers from "./OthersFaxNumbers";
import PharmaciesFaxNumbers from "./PharmaciesFaxNumbers";

type FaxContactsProps = {
  toFaxNumbers: string[];
  setToFaxNumbers: React.Dispatch<React.SetStateAction<string[]>>;
  closeCross?: boolean;
  recipientsRef?: React.MutableRefObject<HTMLDivElement | null>;
};

const FaxContacts = ({
  toFaxNumbers,
  setToFaxNumbers,
  closeCross,
  recipientsRef,
}: FaxContactsProps) => {
  const isContactChecked = (faxNumber: string) =>
    toFaxNumbers.includes(faxNumber);

  const handleClose = () => {
    if (recipientsRef?.current)
      recipientsRef.current.style.transform = "translateX(-200%)";
  };

  const handleCheckContact = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const faxNumber = e.target.id;
    if (checked) {
      setToFaxNumbers([...toFaxNumbers, faxNumber]);
    } else {
      setToFaxNumbers(toFaxNumbers.filter((number) => number !== faxNumber));
    }
  };

  return (
    <div className="fax-contacts">
      <div className="fax-contacts__title">
        Recipients{" "}
        {closeCross && (
          <XmarkRectangleIcon color=" #3d375a" onClick={handleClose} />
        )}
      </div>
      <PharmaciesFaxNumbers
        handleCheckContact={handleCheckContact}
        isContactChecked={isContactChecked}
      />
      <DoctorsFaxNumbers
        handleCheckContact={handleCheckContact}
        isContactChecked={isContactChecked}
      />
      <OthersFaxNumbers
        handleCheckContact={handleCheckContact}
        isContactChecked={isContactChecked}
      />
    </div>
  );
};
export default FaxContacts;
