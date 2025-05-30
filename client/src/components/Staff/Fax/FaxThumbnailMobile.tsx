import React, { useState } from "react";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useFaxDelete } from "../../../hooks/reactquery/mutations/faxMutations";
import { FaxInboxType, FaxOutboxType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { timestampToDateStrTZ } from "../../../utils/dates/formatDates";
import { callerIDToFaxNumber } from "../../../utils/fax/callerIDToFaxNumber";
import Checkbox from "../../UI/Checkbox/Checkbox";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import ClipboardIcon from "../../UI/Icons/ClipboardIcon";
import SquarePlusIcon from "../../UI/Icons/SquarePlusIcon";
import FakeWindow from "../../UI/Windows/FakeWindow";
import ContactFaxForm from "./Contacts/ContactFaxForm";
import FaxNotes from "./FaxNotes";

type FaxThumbnailMobileProps = {
  fax: FaxInboxType | FaxOutboxType;
  setCurrentFaxId: React.Dispatch<React.SetStateAction<string>>;
  setCurrentCallerId: React.Dispatch<React.SetStateAction<string>>;
  setFaxesSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  faxesSelectedIds: string[];
  section: string;
};

const FaxThumbnailMobile = ({
  fax,
  setCurrentFaxId,
  setCurrentCallerId,
  setFaxesSelectedIds,
  faxesSelectedIds,
  section,
}: FaxThumbnailMobileProps) => {
  //Hooks
  const [addFaxNumberVisible, setAddFaxNumberVisible] = useState(false);
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const [notesVisible, setNotesVisible] = useState(false);
  //Queries
  const faxDelete = useFaxDelete();

  // useEffect(() => {
  //   const contactWithFaxNumber = async () => {
  //     const response = await xanoGet("/contact_with_fax_number", "staff", {
  //       fax_number:
  //         section === "Received faxes"
  //           ? callerIDToFaxNumber((fax as FaxInboxType).CallerID)
  //           : callerIDToFaxNumber((fax as FaxOutboxType).ToFaxNumber),
  //     });
  //     if (response) {
  //       setContactName(
  //         response.Name
  //           ? response.Name
  //           : response.name
  //           ? response.name
  //           : response.LastName
  //           ? `${response.LastName}, `
  //           : "" + response.FirstName
  //           ? `${response.FirstName}, `
  //           : "" + response.speciality
  //       );
  //     }
  //   };
  //   contactWithFaxNumber();
  // }, [fax, section]);

  const handleFaxClick = async () => {
    if (section === "Received faxes") {
      setCurrentCallerId((fax as FaxInboxType).CallerID);
      if (
        (fax as FaxInboxType).ViewedStatus === "N" &&
        user.unreadFaxNbr !== 0
      ) {
        socket?.emit("message", {
          route: "UNREAD FAX",
          action: "update",
        });
      }
    }
    setCurrentFaxId(fax.FileName);
  };

  const handleCheckFax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const id = e.target.id;
    if (checked) {
      if (!faxesSelectedIds.includes(id)) {
        setFaxesSelectedIds([...faxesSelectedIds, id]);
      }
    } else {
      setFaxesSelectedIds(faxesSelectedIds.filter((faxId) => faxId !== id));
    }
  };

  const isFaxSelected = (id: string) => {
    return faxesSelectedIds.includes(id);
  };

  const handleAddFaxNumber = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.stopPropagation();
    const response = await xanoGet("/contact_with_fax_number", "staff", {
      fax_number:
        section === "Received faxes"
          ? callerIDToFaxNumber((fax as FaxInboxType).CallerID)
          : callerIDToFaxNumber((fax as FaxOutboxType).ToFaxNumber),
    });
    if (
      !response ||
      (response &&
        (await confirmAlert({
          content:
            "This fax number is already in the directory. Would you still like to create a new contact ?",
        })))
    ) {
      setAddFaxNumberVisible(true);
    }
  };

  const handleClickNotes = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    setNotesVisible(true);
  };

  return (
    <div
      className={
        section === "Received faxes"
          ? (fax as FaxInboxType).ViewedStatus === "Y"
            ? "fax__thumbnail-mobile"
            : "fax__thumbnail-mobile fax__thumbnail-mobile--unread"
          : "fax__thumbnail-mobile"
      }
    >
      <div className="fax__thumbnail-link">
        <Checkbox
          id={fax.FileName}
          onChange={handleCheckFax}
          checked={isFaxSelected(fax.FileName)}
          className="fax__thumbnail-checkbox"
        />
        <div className="fax__thumbnail-author" onClick={handleFaxClick}>
          {section === "Received faxes"
            ? callerIDToFaxNumber((fax as FaxInboxType).CallerID)
            : callerIDToFaxNumber((fax as FaxOutboxType).ToFaxNumber)}{" "}
          {/* / {contactName} */}
        </div>
        <SquarePlusIcon onClick={handleAddFaxNumber} ml={5} />
        <ClipboardIcon ml={15} onClick={handleClickNotes} />
      </div>
      <div className="fax__thumbnail-date" onClick={handleFaxClick}>
        {timestampToDateStrTZ(parseInt(fax.EpochTime) * 1000)}
      </div>
      {addFaxNumberVisible && (
        <FakeWindow
          title="ADD CONTACT TO DIRECTORY"
          width={700}
          height={650}
          x={(window.innerWidth - 700) / 2}
          y={(window.innerHeight - 650) / 2}
          color="#94bae8"
          setPopUpVisible={setAddFaxNumberVisible}
        >
          <ContactFaxForm
            setAddFaxNumberVisible={setAddFaxNumberVisible}
            initialFaxNumber={
              section === "Received faxes"
                ? callerIDToFaxNumber((fax as FaxInboxType).CallerID)
                : callerIDToFaxNumber((fax as FaxOutboxType).ToFaxNumber)
            }
          />
        </FakeWindow>
      )}
      {notesVisible && (
        <FakeWindow
          title="FAX NOTES"
          width={700}
          height={300}
          x={(window.innerWidth - 700) / 2}
          y={(window.innerHeight - 300) / 2}
          color="#94bae8"
          setPopUpVisible={setNotesVisible}
        >
          <FaxNotes fileName={fax.FileName} setNotesVisible={setNotesVisible} />
        </FakeWindow>
      )}
    </div>
  );
};

export default FaxThumbnailMobile;
