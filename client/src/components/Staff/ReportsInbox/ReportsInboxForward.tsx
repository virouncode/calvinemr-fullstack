import React, { useState } from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useReportInboxPut } from "../../../hooks/reactquery/mutations/reportsMutations";
import { ReportType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { splitStaffInfos } from "../../../utils/appointments/splitStaffInfos";
import Button from "../../UI/Buttons/Button";
import CancelButton from "../../UI/Buttons/CancelButton";
import ReportsInboxPracticianCategoryForward from "./ReportsInboxPracticianCategoryForward";

type ReportsInboxForwardProps = {
  setForwardVisible: React.Dispatch<React.SetStateAction<boolean>>;
  reportToForward: ReportType;
};

const ReportsInboxForward = ({
  setForwardVisible,
  reportToForward,
}: ReportsInboxForwardProps) => {
  const { staffInfos } = useStaffInfosContext();
  const categoryInfos = splitStaffInfos(staffInfos, true);
  const { user } = useUserContext() as { user: UserStaffType };
  const [assignedId, setAssignedId] = useState(0);
  const [progress, setProgress] = useState(false);
  const reportInboxPut = useReportInboxPut(user.id);

  const handleCheckPractician = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked) {
      setAssignedId(parseInt(e.target.id));
    } else {
      setAssignedId(0);
    }
  };

  const isPracticianChecked = (id: number) => {
    return assignedId === id;
  };

  const handleCancelForward = () => {
    setForwardVisible(false);
  };
  const handleForwardDocument = async () => {
    setProgress(true);
    reportToForward.assigned_staff_id = assignedId;
    reportInboxPut.mutate(reportToForward, {
      onSuccess: () => {
        setForwardVisible(false);
        setAssignedId(0);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  return (
    <div className="reportsinbox__forward">
      <div className="reportsinbox__forward-title">
        <label>Forward document to practitioner</label>
        <div className="reportsinbox__forward-btns">
          <Button
            onClick={handleForwardDocument}
            disabled={!assignedId || progress}
            label="Forward"
            className="save-btn"
          />
          <CancelButton onClick={handleCancelForward} disabled={progress} />
        </div>
      </div>
      <div className="reportsinbox__forward-list">
        {categoryInfos
          .filter((category) => category.infos.length !== 0)
          .map((category) => (
            <ReportsInboxPracticianCategoryForward
              categoryInfos={category.infos}
              categoryName={category.name}
              handleCheckPractician={handleCheckPractician}
              isPracticianChecked={isPracticianChecked}
              key={category.name}
            />
          ))}
      </div>
    </div>
  );
};

export default ReportsInboxForward;
