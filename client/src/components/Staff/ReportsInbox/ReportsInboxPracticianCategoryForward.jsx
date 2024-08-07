import { useState } from "react";
import SquareMinusIcon from "../../UI/Icons/SquareMinusIcon";
import SquarePlusIcon from "../../UI/Icons/SquarePlusIcon";
import ReportsInboxPracticiansListForward from "./ReportsInboxPracticiansListForward";

const ReportsInboxPracticianCategoryForward = ({
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
      <div className="practicians-forward__category-overview">
        {!listVisible ? (
          <SquarePlusIcon onClick={handleClick} />
        ) : (
          <SquareMinusIcon onClick={handleClick} />
        )}
        <label>{categoryName}</label>
      </div>
      {listVisible && (
        <ReportsInboxPracticiansListForward
          categoryInfos={categoryInfos}
          isPracticianChecked={isPracticianChecked}
          handleCheckPractician={handleCheckPractician}
          categoryName={categoryName}
        />
      )}
    </>
  );
};

export default ReportsInboxPracticianCategoryForward;
