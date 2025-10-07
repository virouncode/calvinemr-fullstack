import React from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  MessageAttachmentType,
  PrescriptionType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { showDocument } from "../../../../../utils/files/showDocument";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import Button from "../../../../UI/Buttons/Button";

type PrescriptionItemProps = {
  item: PrescriptionType;
  setFileToFax: React.Dispatch<
    React.SetStateAction<Partial<MessageAttachmentType> | undefined>
  >;
  setAttachmentsToSend: React.Dispatch<
    React.SetStateAction<Partial<MessageAttachmentType>[] | undefined>
  >;
  setNewMessageExternalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setFaxVisible: React.Dispatch<React.SetStateAction<boolean>>;
  targetRef?: (node: Element | null) => void;
};

const PrescriptionItem = ({
  item,
  setFileToFax,
  setAttachmentsToSend,
  setNewMessageExternalVisible,
  setFaxVisible,
  targetRef,
}: PrescriptionItemProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
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
    <tr className="prescriptions__item" ref={targetRef}>
      <td className="prescriptions__item-btn-container">
        <Button onClick={handleSend} label="Send" />
        <Button onClick={handleFax} label="Fax" />
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
