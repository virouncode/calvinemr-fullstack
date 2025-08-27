import React, { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useFaxFolderPost } from "../../../hooks/reactquery/mutations/faxMutations";
import { FaxFolderType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import Input from "../../UI/Inputs/Input";

type AddFaxFolderFormProps = {
  setAddFolderVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddFaxFolderForm = ({ setAddFolderVisible }: AddFaxFolderFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [newFolderName, setNewFolderName] = useState("");

  const faxFolderPost = useFaxFolderPost();

  const handleSaveNewFolder = async () => {
    const faxFolderToPost: Partial<FaxFolderType> = {
      name: newFolderName,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    faxFolderPost.mutate(faxFolderToPost, {
      onSuccess: () => setAddFolderVisible(false),
    });
  };
  return (
    <div className="fax__add-folder">
      <div className="fax__add-folder-form">
        <Input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          label="New label name: "
        />
      </div>
      <div className="fax__add-folder-btns">
        <SaveButton onClick={handleSaveNewFolder} />
        <CancelButton onClick={() => setAddFolderVisible(false)} />
      </div>
    </div>
  );
};

export default AddFaxFolderForm;
