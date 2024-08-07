import { useState } from "react";
import StaffContactsList from "../../Staff/Messaging/StaffContactsList";
import SquareMinusIcon from "../../UI/Icons/SquareMinusIcon";
import SquarePlusIcon from "../../UI/Icons/SquarePlusIcon";

const ContactsForPatientCategory = ({
  categoryInfos,
  categoryName,
  isContactChecked,
  handleCheckContact,
}) => {
  const [listVisible, setListVisible] = useState(false);
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
    </>
  );
};

export default ContactsForPatientCategory;
