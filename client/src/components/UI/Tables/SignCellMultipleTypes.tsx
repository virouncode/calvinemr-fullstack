import React from "react";
import useAdminsInfosContext from "../../../hooks/context/useAdminsInfosContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { UpdateType } from "../../../types/api";
import { timestampToDateISOTZ } from "../../../utils/dates/formatDates";
import { getLastUpdate, isUpdated } from "../../../utils/dates/updates";
import { adminIdToName } from "../../../utils/names/adminIdToName";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";

type BaseItem = {
  created_by_id: number;
  date_created: number;
  created_by_user_type?: "staff" | "admin";
  updates?: UpdateType[];
};

type SignCellMultipleTypesProps<T extends BaseItem> = {
  item: T;
};

const SignCellMultipleTypes = <T extends BaseItem>({
  item,
}: SignCellMultipleTypesProps<T>) => {
  const { staffInfos } = useStaffInfosContext();
  const { adminsInfos } = useAdminsInfosContext();
  return (
    <>
      <td>
        <em>
          {isUpdated(item)
            ? getLastUpdate(item)?.updated_by_user_type === "staff"
              ? staffIdToTitleAndName(
                  staffInfos,
                  getLastUpdate(item)?.updated_by_id
                )
              : adminIdToName(
                  adminsInfos,
                  getLastUpdate(item)?.updated_by_id ?? 0
                )
            : item.created_by_user_type === "staff"
            ? staffIdToTitleAndName(staffInfos, item.created_by_id)
            : adminIdToName(adminsInfos, item.created_by_id)}
        </em>
      </td>
      <td>
        <em>
          {isUpdated(item)
            ? timestampToDateISOTZ(
                getLastUpdate(item)?.date_updated,
                "America/Toronto"
              )
            : timestampToDateISOTZ(item.date_created, "America/Toronto")}
        </em>
      </td>
    </>
  );
};

export default SignCellMultipleTypes;
