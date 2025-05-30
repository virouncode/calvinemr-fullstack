import React, { useState } from "react";
import { StaffType } from "../../../types/api";
import StaffContactsList from "../../Staff/Messaging/StaffContactsList";
import SquareMinusIcon from "../../UI/Icons/SquareMinusIcon";
import SquarePlusIcon from "../../UI/Icons/SquarePlusIcon";

type PatientStaffContactsCategoryProps = {
  categoryInfos: StaffType[];
  categoryName: string;
  isContactChecked: (id: number) => boolean;
  handleCheckContact: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PatientStaffContactsCategory = ({
  categoryInfos,
  categoryName,
  isContactChecked,
  handleCheckContact,
}: PatientStaffContactsCategoryProps) => {
  //Hooks
  const [listVisible, setListVisible] = useState(false);

  const handleClick = () => {
    setListVisible((v) => !v);
  };

  return (
    <div className="contacts__list-category">
      <div className="contacts__list-category-overview">
        {!listVisible ? (
          <SquarePlusIcon onClick={handleClick} mr={5} />
        ) : (
          <SquareMinusIcon onClick={handleClick} mr={5} />
        )}
        <label>{categoryName}</label>
      </div>
      {listVisible && (
        <StaffContactsList
          categoryInfos={categoryInfos}
          isContactChecked={isContactChecked}
          handleCheckContact={handleCheckContact}
          categoryName={categoryName}
        />
      )}
    </div>
  );
};

export default PatientStaffContactsCategory;
