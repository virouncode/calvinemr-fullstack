import React, { useState } from "react";
import { StaffType } from "../../../types/api";
import Checkbox from "../../UI/Checkbox/Checkbox";
import SquareMinusIcon from "../../UI/Icons/SquareMinusIcon";
import SquarePlusIcon from "../../UI/Icons/SquarePlusIcon";
import StaffContactsList from "./StaffContactsList";

type StaffContactsCategoryProps = {
  categoryInfos: StaffType[];
  categoryName: string;
  isContactChecked: (id: number) => boolean;
  handleCheckContact: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isCategoryChecked: (category: string) => boolean;
  handleCheckCategory: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initiallyUnfolded: boolean;
};

const StaffContactsCategory = ({
  categoryInfos,
  categoryName,
  isContactChecked,
  handleCheckContact,
  isCategoryChecked,
  handleCheckCategory,
  initiallyUnfolded,
}: StaffContactsCategoryProps) => {
  //Hooks
  const [listVisible, setListVisible] = useState(initiallyUnfolded);

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
        <Checkbox
          id={categoryName}
          onChange={handleCheckCategory}
          checked={isCategoryChecked(categoryName)}
          label={categoryName}
        />
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

export default StaffContactsCategory;
