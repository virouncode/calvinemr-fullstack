import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { usePatientPut } from "../../../../hooks/reactquery/mutations/patientsMutations";
import { DemographicsType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";
import SaveButton from "../../../UI/Buttons/SaveButton";
import StaffList from "../../../UI/Lists/StaffList";

type ClosedPracticianAccountProps = {
  demographicsInfos: DemographicsType;
};

const ClosedPracticianAccount = ({
  demographicsInfos,
}: ClosedPracticianAccountProps) => {
  //Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const [assignedStaffId, setAssignedStaffId] = useState(1);
  //Queries
  const patientPut = usePatientPut(demographicsInfos.patient_id);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAssignedStaffId(parseInt(e.target.value));
  };
  const handleSubmit = async () => {
    const patientToPut = {
      ...demographicsInfos,
      assigned_staff_id: assignedStaffId,
      updates: [
        ...demographicsInfos.updates,
        { date_updated: nowTZTimestamp(), updated_by_id: user.id },
      ],
    };
    patientPut.mutate(patientToPut, {
      onSuccess: () => {
        navigate(location.pathname);
      },
    });
  };
  return (
    <div className="closed-practician">
      <div className="closed-practician__message">{`This patient is assigned to ${staffIdToTitleAndName(
        staffInfos,
        staffInfos.find(({ id }) => id === demographicsInfos.assigned_staff_id)
          ?.id,
        false,
        true
      )}, who is no longer working at this clinic.`}</div>
      <div className="closed-practician__form">
        <label>
          {`Please assign a new practitioner to ${toPatientName(
            demographicsInfos
          )}  to access ${demographicsInfos.Gender === "M" ? "his" : "her"}
          record:`}
        </label>
        <StaffList
          value={assignedStaffId}
          handleChange={handleChange}
          name="assignedMd"
        />
        <SaveButton onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default ClosedPracticianAccount;
