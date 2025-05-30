import React from "react";
import { FaxContactType } from "../../../../types/api";
import Checkbox from "../../../UI/Checkbox/Checkbox";

type OtherFaxNumberItemProps = {
  other: FaxContactType;
  handleCheckContact: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isContactChecked: (faxNumber: string) => boolean;
  lastItemRef?: (node: Element | null) => void;
};

const OtherFaxNumberItem = ({
  other,
  handleCheckContact,
  isContactChecked,
  lastItemRef,
}: OtherFaxNumberItemProps) => {
  const label = `${other.name ? `${other.name}, ` : ""}${
    other.category ? `${other.category} ` : ""
  }`;
  return (
    <li className="fax-numbers__item" ref={lastItemRef}>
      <Checkbox
        id={other.fax_number}
        name={other.name}
        onChange={handleCheckContact}
        checked={isContactChecked(other.fax_number)}
        label={label}
      />
    </li>
  );
};

export default OtherFaxNumberItem;
