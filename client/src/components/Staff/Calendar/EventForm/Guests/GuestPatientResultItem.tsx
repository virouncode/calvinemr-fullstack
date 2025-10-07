import React from "react";
import { DemographicsType } from "../../../../../types/api";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import UserPlusIcon from "../../../../UI/Icons/UserPlusIcon";

type GuestPatientResultItemProps = {
  guest: DemographicsType;
  handleAddPatientGuest: (guest: DemographicsType) => void;
  targetRef?: (node: Element | null) => void;
};

const GuestPatientResultItem = ({
  guest,
  handleAddPatientGuest,
  targetRef,
}: GuestPatientResultItemProps) => {
  return (
    <li ref={targetRef}>
      <span>{toPatientName(guest)}</span>
      <UserPlusIcon ml={10} onClick={() => handleAddPatientGuest(guest)} />
    </li>
  );
};

export default GuestPatientResultItem;
