import { useState } from "react";
import Checkbox from "../../UI/Checkbox/Checkbox";
import StaffContactsList from "./StaffContactsList";

const StaffContactsCategory = ({
  categoryInfos,
  categoryName,
  isContactChecked,
  handleCheckContact,
  isCategoryChecked,
  handleCheckCategory,
  initiallyVisible,
}) => {
  const [listVisible, setListVisible] = useState(initiallyVisible);
  const handleClick = () => {
    setListVisible((v) => !v);
  };
  return (
    <>
      <div className="contacts__category-overview">
        {!listVisible ? (
          <i
            onClick={handleClick}
            className="fa-regular fa-square-plus fa-lg"
          />
        ) : (
          <i
            onClick={handleClick}
            className="fa-regular fa-square-minus fa-lg"
          />
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
