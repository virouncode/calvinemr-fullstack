import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { showDocument } from "../../../../../utils/files/showDocument";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";

const PrescriptionItem = ({
  item,
  setFileToFax,
  setAttachmentsToSend,
  setNewMessageExternalVisible,
  setFaxVisible,
  lastItemRef = null,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();

  const handleFax = () => {
    setFileToFax({ alias: item.attachment.alias, file: item.attachment.file });
    setFaxVisible(true);
  };
  const handleSend = () => {
    setAttachmentsToSend([
      {
        file: item.attachment.file,
        alias: item.attachment.alias,
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
        created_by_user_type: "staff",
      },
    ]);
    setNewMessageExternalVisible(true);
  };
  return (
    <tr className="prescriptions__item" ref={lastItemRef}>
      <td className="prescriptions__item-btn-container">
        <button onClick={handleSend}>Send</button>
        <button onClick={handleFax}>Fax</button>
        {/* <button onClick={handleDelete}>Delete</button> */}
      </td>
      <td
        className="prescriptions__link"
        onClick={() =>
          showDocument(item.attachment.file.url, item.attachment.file.mime)
        }
      >
        {item.attachment.alias}
      </td>
      <td>{item.unique_id}</td>
      <td>
        <em>
          {staffIdToTitleAndName(staffInfos, item.attachment.created_by_id)}
        </em>
      </td>
      <td>
        <em>{timestampToDateISOTZ(item.attachment.date_created)}</em>
      </td>
    </tr>
  );
};

export default PrescriptionItem;
