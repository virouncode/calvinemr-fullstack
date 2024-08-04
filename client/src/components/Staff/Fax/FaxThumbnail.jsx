import { useEffect, useState } from "react";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { useFaxDelete } from "../../../hooks/reactquery/mutations/faxMutations";
import { timestampToDateTimeStrTZ } from "../../../utils/dates/formatDates";
import { callerIDToFaxNumber } from "../../../utils/fax/callerIDToFaxNumber";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import FakeWindow from "../../UI/Windows/FakeWindow";
import ContactFaxForm from "./ContactFaxForm";

const FaxThumbnail = ({
  fax,
  setCurrentFaxId,
  setCurrentCallerId,
  setFaxesSelectedIds,
  faxesSelectedIds,
  section,
}) => {
  const [addFaxNumberVisible, setAddFaxNumberVisible] = useState(false);
  const [contactName, setContactName] = useState("");
  const faxDelete = useFaxDelete();

  useEffect(() => {
    const contactWithFaxNumber = async () => {
      const response = await xanoGet("/contact_with_fax_number", "staff", {
        fax_number:
          section === "Received faxes"
            ? callerIDToFaxNumber(fax.CallerID)
            : callerIDToFaxNumber(fax.ToFaxNumber),
      });
      if (response) {
        setContactName(
          response.Name
            ? response.Name
            : response.name
            ? response.name
            : response.LastName
            ? `${response.LastName}, `
            : "" + response.FirstName
            ? `${response.FirstName}, `
            : "" + response.speciality
        );
      }
    };
    contactWithFaxNumber();
  }, [fax.CallerID, fax.ToFaxNumber, section]);

  const handleFaxClick = async () => {
    if (section === "Received faxes") {
      setCurrentCallerId(fax.CallerID);
    }
    setCurrentFaxId(fax.FileName);
  };

  const handleCheckFax = (e) => {
    const checked = e.target.checked;
    const id = e.target.id;
    if (checked) {
      if (!faxesSelectedIds.includes(id)) {
        setFaxesSelectedIds([...faxesSelectedIds, id]);
      }
    } else {
      let faxesSelectedIdsUpdated = [...faxesSelectedIds];
      faxesSelectedIdsUpdated = faxesSelectedIdsUpdated.filter(
        (faxId) => faxId !== id
      );
      setFaxesSelectedIds(faxesSelectedIdsUpdated);
    }
  };

  const isFaxSelected = (id) => {
    return faxesSelectedIds.includes(id);
  };

  const handleDeleteFax = async () => {
    if (
      await confirmAlert({
        content:
          "Do you really want to delete this fax (this action is irreversible)?",
      })
    ) {
      const faxToDelete = {
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

  const handleAddFaxNumber = async (e) => {
    e.stopPropagation();
    const response = await xanoGet("/contact_with_fax_number", "staff", {
      fax_number:
        section === "Received faxes"
          ? callerIDToFaxNumber(fax.CallerID)
          : callerIDToFaxNumber(fax.ToFaxNumber),
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
          ? fax.ViewedStatus === "Y"
            ? "fax-thumbnail"
            : "fax-thumbnail fax-thumbnail--unread"
          : "fax-thumbnail"
      }
    >
      <input
        className="fax-thumbnail__checkbox"
        type="checkbox"
        id={fax.FileName}
        checked={isFaxSelected(fax.FileName)}
        onChange={handleCheckFax}
      />
      <div onClick={handleFaxClick} className="fax-thumbnail__link">
        <div className="fax-thumbnail__author">
          {section === "Received faxes"
            ? callerIDToFaxNumber(fax.CallerID)
            : callerIDToFaxNumber(fax.ToFaxNumber)}{" "}
          / {contactName}
        </div>
        <i
          className="fa-regular fa-square-plus"
          onClick={handleAddFaxNumber}
          style={{ marginLeft: "5px", cursor: "pointer" }}
        />
      </div>
      <div className="fax-thumbnail__pages">{fax.Pages}</div>
      <div className="fax-thumbnail__date">
        {timestampToDateTimeStrTZ(fax.EpochTime * 1000)}
      </div>
      <div className="fax-thumbnail__logos">
        <i
          className="fa-solid fa-trash  fax-thumbnail__trash"
          style={{ cursor: "pointer" }}
          onClick={handleDeleteFax}
        />
      </div>
      {addFaxNumberVisible && (
        <FakeWindow
          title="ADD CONTACT TO DIRECTORY"
          width={700}
          height={480}
          x={(window.innerWidth - 700) / 2}
          y={(window.innerHeight - 480) / 2}
          color="#94bae8"
          setPopUpVisible={setAddFaxNumberVisible}
        >
          <ContactFaxForm
            setAddFaxNumberVisible={setAddFaxNumberVisible}
            initialFaxNumber={
              section === "Received faxes"
                ? callerIDToFaxNumber(fax.CallerID)
                : callerIDToFaxNumber(fax.ToFaxNumber)
            }
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default FaxThumbnail;
