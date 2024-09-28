import React from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { StaffType } from "../../../types/api";
import ReportsInboxPracticiansListItemForward from "./ReportsInboxPracticiansListItemForward";

type ReportsInboxPracticiansListForwardProps = {
  categoryInfos: StaffType[];
  categoryName: string;
  isPracticianChecked: (id: number) => boolean;
  handleCheckPractician: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ReportsInboxPracticiansListForward = ({
  categoryInfos,
  handleCheckPractician,
  isPracticianChecked,
  categoryName,
}: ReportsInboxPracticiansListForwardProps) => {
  const { user } = useUserContext() as { user: StaffType };
  return (
    <ul className="reportsinbox__forward-category-list">
      {categoryInfos
        .filter(({ id }) => id !== user.id)
        .map((info) => (
          <ReportsInboxPracticiansListItemForward
            info={info}
            key={info.id}
            handleCheckPractician={handleCheckPractician}
            isPracticianChecked={isPracticianChecked}
            categoryName={categoryName}
          />
        ))}
    </ul>
  );
};

export default ReportsInboxPracticiansListForward;
