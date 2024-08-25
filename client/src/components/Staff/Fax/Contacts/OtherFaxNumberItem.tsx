import React from "react";
import { FaxContactType } from "../../../../types/api";

type OtherFaxNumberItemProps = {
  other: FaxContactType;
  handleClickOther: (other: FaxContactType) => void;
  lastItemRef?: (node: Element | null) => void;
};

const OtherFaxNumberItem = ({
  other,
  handleClickOther,
  lastItemRef,
}: OtherFaxNumberItemProps) => {
  return (
    <li
      className="fax-numbers__item"
      ref={lastItemRef}
      onClick={() => handleClickOther(other)}
    >
      {other.name}, {other.category}
    </li>
  );
};

export default OtherFaxNumberItem;
