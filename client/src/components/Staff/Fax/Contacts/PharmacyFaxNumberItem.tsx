import React from "react";
import { PharmacyType } from "../../../../types/api";
import Checkbox from "../../../UI/Checkbox/Checkbox";

type PharmacyFaxNumberItemProps = {
  pharmacy: PharmacyType;
  handleCheckContact: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isContactChecked: (faxNumber: string) => boolean;
  targetRef?: (node: Element | null) => void;
};

const PharmacyFaxNumberItem = ({
  pharmacy,
  handleCheckContact,
  isContactChecked,
  targetRef,
}: PharmacyFaxNumberItemProps) => {
  return (
    <li className="fax-numbers__item" ref={targetRef}>
      <Checkbox
        id={pharmacy.FaxNumber.phoneNumber}
        name={pharmacy.Name}
        onChange={handleCheckContact}
        checked={isContactChecked(pharmacy.FaxNumber.phoneNumber)}
        label={`${pharmacy.Name}, ${pharmacy.Address.Structured.City}`}
      />
    </li>
  );
};

export default PharmacyFaxNumberItem;
