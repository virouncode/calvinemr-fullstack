import React, { useState } from "react";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useFaxDelete } from "../../../hooks/reactquery/mutations/faxMutations";
import {
  FaxInboxType,
  FaxOutboxType,
  FaxToDeleteType,
} from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { timestampToDateTimeStrTZ } from "../../../utils/dates/formatDates";
import { callerIDToFaxNumber } from "../../../utils/fax/callerIDToFaxNumber";
import Checkbox from "../../UI/Checkbox/Checkbox";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import SquarePlusIcon from "../../UI/Icons/SquarePlusIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";
import FakeWindow from "../../UI/Windows/FakeWindow";
import ContactFaxForm from "./Contacts/ContactFaxForm";

type FaxThumbnailProps = {
  fax: FaxInboxType | FaxOutboxType;
  setCurrentFaxId: React.Dispatch<React.SetStateAction<string>>;
  setCurrentCallerId: React.Dispatch<React.SetStateAction<string>>;
  setFaxesSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  faxesSelectedIds: string[];
  section: string;
};

const FaxThumbnail = ({
  fax,
  setCurrentFaxId,
  setCurrentCallerId,
  setFaxesSelectedIds,
  faxesSelectedIds,
  section,
}: FaxThumbnailProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const [addFaxNumberVisible, setAddFaxNumberVisible] = useState(false);
  const [contactName, setContactName] = useState("");
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
          route: "USER",
          action: "update",
          content: {
            id: user.id,
            data: {
              ...user,
              unreadFaxNbr: user.unreadFaxNbr - 1,
            },
          },
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

  const handleDeleteFax = async () => {
    if (
      await confirmAlert({
        content:
          "Do you really want to delete this fax (this action is irreversible)?",
      })
    ) {
      const faxToDelete: FaxToDeleteType = {
        faxFileName: fax.FileName,
        direction: section === "Received faxes" ? "IN" : "OUT",
      };
      faxDelete.mutate(faxToDelete, {
        onSuccess: () => {
          setFaxesSelectedIds([]);
        },
      });
    }
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

  return (
    <div
      className={
        section === "Received faxes"
          ? (fax as FaxInboxType).ViewedStatus === "Y"
            ? "fax__thumbnail"
            : "fax__thumbnail fax__thumbnail--unread"
          : "fax__thumbnail"
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
          / {contactName}
        </div>
        <SquarePlusIcon onClick={handleAddFaxNumber} ml={5} />
      </div>
      <div className="fax__thumbnail-pages" onClick={handleFaxClick}>
        {fax.Pages}
      </div>
      <div className="fax__thumbnail-date" onClick={handleFaxClick}>
        {timestampToDateTimeStrTZ(parseInt(fax.EpochTime) * 1000)}
      </div>
      <div className="fax__thumbnail-logos">
        <TrashIcon onClick={handleDeleteFax} />
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
    </div>
  );
};

export default FaxThumbnail;
