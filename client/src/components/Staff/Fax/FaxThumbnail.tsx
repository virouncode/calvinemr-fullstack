import { Tooltip } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useFaxDelete,
  useFaxNotesDelete,
} from "../../../hooks/reactquery/mutations/faxMutations";
import {
  FaxInboxType,
  FaxNotesType,
  FaxOutboxType,
  FaxToDeleteType,
} from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { timestampToDateTimeStrTZ } from "../../../utils/dates/formatDates";
import { callerIDToFaxNumber } from "../../../utils/fax/callerIDToFaxNumber";
import Checkbox from "../../UI/Checkbox/Checkbox";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import PenIcon from "../../UI/Icons/PenIcon";
import SquarePlusIcon from "../../UI/Icons/SquarePlusIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";
import FakeWindow from "../../UI/Windows/FakeWindow";
import ContactFaxForm from "./Contacts/ContactFaxForm";
import FaxNotes from "./FaxNotes";

type FaxThumbnailProps = {
  fax:
    | (FaxInboxType & { contactName: string; note: string })
    | (FaxOutboxType & { contactName: string; note: string });
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
  const [notesVisible, setNotesVisible] = useState(false);
  //Queries
  const faxDelete = useFaxDelete();
  const faxNotesDelete = useFaxNotesDelete();

  const faxNumber =
    section === "Received faxes"
      ? callerIDToFaxNumber((fax as FaxInboxType).CallerID)
      : callerIDToFaxNumber((fax as FaxOutboxType).ToFaxNumber);

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

  const handleDeleteFax = async () => {
    if (
      await confirmAlert({
        content:
          "Do you really want to delete this fax (this action is irreversible)?",
      })
    ) {
      //Delete fax notes
      try {
        const faxNotesToDelete: FaxNotesType = await xanoGet(
          "/faxnotes_for_filename",
          "staff",
          {
            file_name: fax.FileName,
          }
        );
        if (faxNotesToDelete) {
          faxNotesDelete.mutate(faxNotesToDelete.id, {
            onError: (err) => {
              toast.error(`Unable to delete fax notes: ${err}`, {
                containerId: "A",
              });
            },
          });
        }
      } catch (err) {
        if (err instanceof Error)
          toast.error(`Unable to delete fax notes: ${err.message}`, {
            containerId: "A",
          });
        return;
      }
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

  const handleClickNotes = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    setNotesVisible(true);
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
          {faxNumber} ({fax.contactName || "Unknown"})
        </div>
        <SquarePlusIcon onClick={handleAddFaxNumber} ml={5} />
      </div>
      <div className="fax__thumbnail-notes" onClick={handleFaxClick}>
        <p className="fax__thumbnail-notes-text">{fax.note}</p>
        <Tooltip title="Edit">
          <span>
            <PenIcon ml={15} onClick={handleClickNotes} />
          </span>
        </Tooltip>
      </div>
      <div className="fax__thumbnail-date" onClick={handleFaxClick}>
        {timestampToDateTimeStrTZ(parseInt(fax.EpochTime) * 1000)}
      </div>
      {import.meta.env.VITE_ISDEMO === "false" && (
        <div className="fax__thumbnail-logos">
          <TrashIcon onClick={handleDeleteFax} />
        </div>
      )}
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

export default FaxThumbnail;
