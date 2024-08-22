import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { UpdateType } from "../../../types/api";
import { timestampToDateISOTZ } from "../../../utils/dates/formatDates";
import { getLastUpdate, isUpdated } from "../../../utils/dates/updates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";

type BaseItem = {
  created_by_id: number;
  date_created: number;
  updates?: UpdateType[];
};

type SignCellProps<T extends BaseItem> = {
  item: T;
};

const SignCell = <T extends BaseItem>({ item }: SignCellProps<T>) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <>
      <td>
        <em>
          {isUpdated(item)
            ? staffIdToTitleAndName(
                staffInfos,
                getLastUpdate(item)?.updated_by_id
              )
            : staffIdToTitleAndName(staffInfos, item.created_by_id)}
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

export default SignCell;
