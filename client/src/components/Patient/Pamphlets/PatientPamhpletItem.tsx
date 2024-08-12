import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { PamphletType } from "../../../types/api";
import { timestampToDateISOTZ } from "../../../utils/dates/formatDates";
import { showDocument } from "../../../utils/files/showDocument";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";

type PatientPamphletItemType = {
  item: PamphletType;
  lastItemRef?: (node: Element | null) => void;
};

const PatientPamphletItem = ({
  item,
  lastItemRef,
}: PatientPamphletItemType) => {
  const { staffInfos } = useStaffInfosContext();

  return (
    item && (
      <tr className="patient-pamphlets__item" ref={lastItemRef}>
        <td style={{ textAlign: "left" }}>{item.name}</td>
        <td
          className="patient-pamphlets__item-link"
          onClick={() => showDocument(item.file?.url, item.file?.mime)}
        >
          {item.file.name}
        </td>
        <td>{item.notes}</td>
        <td>{staffIdToTitleAndName(staffInfos, item.created_by_id)}</td>
        <td>{timestampToDateISOTZ(item.date_created)}</td>
      </tr>
    )
  );
};

export default PatientPamphletItem;
