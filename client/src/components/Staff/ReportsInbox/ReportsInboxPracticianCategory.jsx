import { useState } from "react";
import SquareMinusIcon from "../../UI/Icons/SquareMinusIcon";
import SquarePlusIcon from "../../UI/Icons/SquarePlusIcon";
import ReportsInboxPracticiansList from "./ReportsInboxPracticiansList";

const ReportsInboxPracticianCategory = ({
  categoryInfos,
  categoryName,
  isPracticianChecked,
  handleCheckPractician,
}) => {
  const [listVisible, setListVisible] = useState(false);
  const handleClick = () => {
    setListVisible((v) => !v);
  };

  return (
    <>
      <div className="practicians__category-overview">
        {!listVisible ? (
          <SquarePlusIcon onClick={handleClick} />
        ) : (
          <SquareMinusIcon onClick={handleClick} />
        )}
        <label>{categoryName}</label>
      </div>
      {listVisible && (
        <ReportsInboxPracticiansList
          categoryInfos={categoryInfos}
          isPracticianChecked={isPracticianChecked}
          handleCheckPractician={handleCheckPractician}
          categoryName={categoryName}
        />
      )}
    </>
  );
};

export default ReportsInboxPracticianCategory;
