import React from "react";
import { PharmacyType } from "../../../../types/api";
import Checkbox from "../../../UI/Checkbox/Checkbox";

type PharmacyFaxNumberItemProps = {
  pharmacy: PharmacyType;
  handleCheckContact: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isContactChecked: (faxNumber: string) => boolean;
  lastItemRef?: (node: Element | null) => void;
};

const PharmacyFaxNumberItem = ({
  pharmacy,
  handleCheckContact,
  isContactChecked,
  lastItemRef,
}: PharmacyFaxNumberItemProps) => {
  return (
    <li className="fax-numbers__item" ref={lastItemRef}>
      <Checkbox
        id={pharmacy.FaxNumber.phoneNumber}
        name={pharmacy.Name}
        onChange={handleCheckContact}
        checked={isContactChecked(pharmacy.FaxNumber.phoneNumber)}
        label={pharmacy.Name}
      />
    </li>
  );
};

export default PharmacyFaxNumberItem;
