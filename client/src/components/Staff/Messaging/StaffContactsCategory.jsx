import { useState } from "react";
import Checkbox from "../../UI/Checkbox/Checkbox";
import SquareMinusIcon from "../../UI/Icons/SquareMinusIcon";
import SquarePlusIcon from "../../UI/Icons/SquarePlusIcon";
import StaffContactsList from "./StaffContactsList";

const StaffContactsCategory = ({
  categoryInfos,
  categoryName,
  isContactChecked,
  handleCheckContact,
  isCategoryChecked,
  handleCheckCategory,
  initiallyUnfolded,
}) => {
  const [listVisible, setListVisible] = useState(initiallyUnfolded);
  const handleClick = () => {
    setListVisible((v) => !v);
  };
  return (
    <>
      <div className="contacts__category-overview">
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
    </>
  );
};

export default StaffContactsCategory;
