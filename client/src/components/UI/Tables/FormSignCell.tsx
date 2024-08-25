import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";

const FormSignCell = () => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  return (
    <>
      <td>
        <em>{staffIdToTitleAndName(staffInfos, user?.id)}</em>
      </td>
      <td>
        <em>{timestampToDateISOTZ(nowTZTimestamp())}</em>
      </td>
    </>
  );
};

export default FormSignCell;
