
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { timestampToDateISOTZ } from "../../../utils/dates/formatDates";
import { showDocument } from "../../../utils/files/showDocument";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";

const PatientPamphletItem = ({ item, lastItemRef = null }) => {
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
