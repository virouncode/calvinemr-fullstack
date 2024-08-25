import React, { useState } from "react";
import { StaffType } from "../../../types/api";
import SquareMinusIcon from "../../UI/Icons/SquareMinusIcon";
import SquarePlusIcon from "../../UI/Icons/SquarePlusIcon";
import ReportsInboxPracticiansListForward from "./ReportsInboxPracticiansListForward";

type ReportsInboxPracticianCategoryForwardProps = {
  categoryInfos: StaffType[];
  categoryName: string;
  isPracticianChecked: (id: number) => boolean;
  handleCheckPractician: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ReportsInboxPracticianCategoryForward = ({
  categoryInfos,
  categoryName,
  isPracticianChecked,
  handleCheckPractician,
}: ReportsInboxPracticianCategoryForwardProps) => {
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
