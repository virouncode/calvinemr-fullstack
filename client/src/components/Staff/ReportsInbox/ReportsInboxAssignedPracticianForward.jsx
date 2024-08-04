import { useState } from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useReportInboxPut } from "../../../hooks/reactquery/mutations/reportsMutations";
import Button from "../../UI/Buttons/Button";
import CancelButton from "../../UI/Buttons/CancelButton";
import ReportsInboxPracticianCategoryForward from "./ReportsInboxPracticianCategoryForward";

const ReportsInboxAssignedPracticianForward = ({
  setForwardVisible,
  reportToForward,
}) => {
  const { staffInfos } = useStaffInfosContext();
  const activeStaff = staffInfos.filter(
    ({ account_status }) => account_status !== "Closed"
  );
  const doctorsInfos = {
    name: "Doctors",
    infos: activeStaff.filter(({ title }) => title === "Doctor"),
  };
  const medStudentsInfos = {
    name: "Medical Students",
    infos: activeStaff.filter(({ title }) => title === "Medical Student"),
  };
  const nursesInfos = {
    name: "Nurses",
    infos: activeStaff.filter(({ title }) => title === "Nurse"),
  };
  const nursingStudentsInfos = {
    name: "Nursing Students",
    infos: activeStaff.filter(({ title }) => title === "Nursing Student"),
  };
  const ultrasoundInfos = {
    name: "Ultra Sound Techs",
    infos: activeStaff.filter(
      ({ title }) => title === "Ultra Sound Technician"
    ),
  };
  const labTechInfos = {
    name: "Lab Techs",
    infos: activeStaff.filter(({ title }) => title === "Lab Technician"),
  };
  const nutritionistInfos = {
    name: "Nutritionists",
    infos: activeStaff.filter(({ title }) => title === "Nutritionist"),
  };
  const physiosInfos = {
    name: "Physiotherapists",
    infos: activeStaff.filter(({ title }) => title === "Physiotherapist"),
  };
  const psychosInfos = {
    name: "Psychologists",
    infos: activeStaff.filter(({ title }) => title === "Psychologist"),
  };
  const othersInfos = {
    name: "Others",
    infos: activeStaff.filter(({ title }) => title === "Other"),
  };
  const allInfos = [
    doctorsInfos,
    medStudentsInfos,
    nursesInfos,
    nursingStudentsInfos,
    ultrasoundInfos,
    labTechInfos,
    nutritionistInfos,
    physiosInfos,
    psychosInfos,
    othersInfos,
  ];
  const { user } = useUserContext();
  const [assignedId, setAssignedId] = useState(0);
  const [progress, setProgress] = useState(false);
  const reportInboxPut = useReportInboxPut(user.id);

  const handleCheckPractician = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setAssignedId(parseInt(e.target.id));
    } else {
      setAssignedId(0);
    }
  };

  const isPracticianChecked = (id) => {
    return assignedId === parseInt(id);
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
    <div className="practicians-forward">
      <div className="practicians-forward__title">
        <label>Forward document to practitioner</label>
        <div className="practicians-forward__btn">
          <Button
            onClick={handleForwardDocument}
            disabled={!assignedId || progress}
            label="Forward"
          />
          <CancelButton onClick={handleCancelForward} disabled={progress} />
        </div>
      </div>
      <div className="practicians-forward__list">
        {allInfos
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

export default ReportsInboxAssignedPracticianForward;
