import React from "react";
import { DemographicsType } from "../../../../../types/api";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import UserPlusIcon from "../../../../UI/Icons/UserPlusIcon";

type GuestPatientResultItemProps = {
  guest: DemographicsType;
  handleAddPatientGuest: (guest: DemographicsType) => void;
  lastItemRef?: (node: Element | null) => void;
};

const GuestPatientResultItem = ({
  guest,
  handleAddPatientGuest,
  lastItemRef,
}: GuestPatientResultItemProps) => {
  return (
    <li ref={lastItemRef}>
      <span>{toPatientName(guest)}</span>
      <UserPlusIcon ml={10} onClick={() => handleAddPatientGuest(guest)} />
    </li>
  );
};

export default GuestPatientResultItem;
