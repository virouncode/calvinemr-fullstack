import React from "react";
import { StaffType } from "../../../types/api";
import StaffContactsListItem from "./StaffContactsListItem";

type StaffContactsListProps = {
  categoryInfos: StaffType[];
  handleCheckContact: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isContactChecked: (id: number) => boolean;
  categoryName: string;
};

const StaffContactsList = ({
  categoryInfos,
  handleCheckContact,
  isContactChecked,
  categoryName,
}: StaffContactsListProps) => {
  return (
    <ul className="contacts-list">
      {categoryInfos.map((info) => (
        <StaffContactsListItem
          info={info}
          key={info.id}
          handleCheckContact={handleCheckContact}
          isContactChecked={isContactChecked}
          categoryName={categoryName}
        />
      ))}
    </ul>
  );
};

export default StaffContactsList;
