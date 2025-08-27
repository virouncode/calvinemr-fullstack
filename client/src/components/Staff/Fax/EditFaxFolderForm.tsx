import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { xanoDelete } from "../../../api/xanoCRUD/xanoDelete";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useFaxFolderDelete,
  useFaxFolderPut,
} from "../../../hooks/reactquery/mutations/faxMutations";
import { FaxFolderType, FiledFaxType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import CancelButton from "../../UI/Buttons/CancelButton";
import DeleteButton from "../../UI/Buttons/DeleteButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import Input from "../../UI/Inputs/Input";

type EditFaxFolderFormProps = {
  setEditFolderVisible: React.Dispatch<React.SetStateAction<boolean>>;
  faxFolder: FaxFolderType;
  setSection: React.Dispatch<React.SetStateAction<string>>;
};

const EditFaxFolderForm = ({
  setEditFolderVisible,
  faxFolder,
  setSection,
}: EditFaxFolderFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [newFolderName, setNewFolderName] = useState(faxFolder.name);

  const faxFolderPut = useFaxFolderPut();
  const faxFolderDelete = useFaxFolderDelete();

  useEffect(() => {
    setNewFolderName(faxFolder.name);
  }, [faxFolder]);

  const handleSaveFolder = async () => {
    const faxFolderToPut: FaxFolderType = {
      ...faxFolder,
      name: newFolderName,
      created_by_id: user.id,
      date_created: nowTZTimestamp(),
    };
    faxFolderPut.mutate(faxFolderToPut, {
      onSuccess: () => setEditFolderVisible(false),
    });
  };
  const handleDeleteFolder = async () => {
    if (
      await confirmAlert({
        title: "Confirmation",
        content: "Do you really want to delete this folder?",
      })
    ) {
      try {
        const filedFaxesOfFolder: FiledFaxType[] = await xanoGet(
          "/faxes_for_folder_id",
          "staff",
          {
            folder_id: faxFolder.id,
          }
        );
        const filedFaxToDeleteId = filedFaxesOfFolder.map(({ id }) => id);
        await xanoDelete("/filed_faxes_batch", "staff", {
          filed_faxes_to_delete_ids: filedFaxToDeleteId,
        });
        faxFolderDelete.mutate(faxFolder.id, {
          onSuccess: () => setEditFolderVisible(false),
        });
        setEditFolderVisible(false);
        setSection("Received faxes");
      } catch (err) {
        if (err instanceof Error) {
          toast.error("Error deleting filed faxes", { containerId: "A" });
        }
      }
    }
  };
  return (
    <div className="fax__add-folder">
      <div className="fax__add-folder-form">
        <Input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          label="Label name: "
        />
      </div>
      <div className="fax__add-folder-btns">
        <SaveButton onClick={handleSaveFolder} />
        <DeleteButton onClick={handleDeleteFolder} />
        <CancelButton onClick={() => setEditFolderVisible(false)} />
      </div>
    </div>
  );
};

export default EditFaxFolderForm;
