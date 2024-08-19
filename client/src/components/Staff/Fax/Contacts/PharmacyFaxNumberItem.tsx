import React from "react";
import { PharmacyType } from "../../../../types/api";

type PharmacyFaxNumberItemProps = {
  pharmacy: PharmacyType;
  handleClickPharmacy: (pharmacy: PharmacyType) => void;
  lastItemRef?: (node: Element | null) => void;
};

const PharmacyFaxNumberItem = ({
  pharmacy,
  handleClickPharmacy,
  lastItemRef,
}: PharmacyFaxNumberItemProps) => {
  return (
    <li
      className="fax-numbers__item"
      ref={lastItemRef}
      onClick={() => handleClickPharmacy(pharmacy)}
    >
      {pharmacy.Name}
    </li>
  );
};

export default PharmacyFaxNumberItem;
