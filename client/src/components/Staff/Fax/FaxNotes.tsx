import React, { useEffect, useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useFaxNotesPost,
  useFaxNotesPut,
} from "../../../hooks/reactquery/mutations/faxMutations";
import { useFaxNotes } from "../../../hooks/reactquery/queries/faxQueries";
import { FaxNotesType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";

type FaxNoteProps = {
  fileName: string;
  setNotesVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const FaxNotes = ({ fileName, setNotesVisible }: FaxNoteProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [notes, setNotes] = useState("");
  const { data: faxNotes, isPending, error } = useFaxNotes(fileName);

  const faxNotesPost = useFaxNotesPost();
  const faxNotesPut = useFaxNotesPut();

  useEffect(() => {
    if (faxNotes) setNotes(faxNotes.Notes);
  }, [faxNotes]);

  const handleSave = async () => {
    if (faxNotes) {
      const faxNotesToPut: FaxNotesType = {
        ...faxNotes,
        Notes: notes,
        updates: [
          ...faxNotes.updates,
          { date_updated: nowTZTimestamp(), updated_by_id: user.id },
        ],
      };
      faxNotesPut.mutate(faxNotesToPut, {
        onSuccess: () => {
          setNotesVisible(false);
        },
      });
    } else {
      const faxNotesToPost: Partial<FaxNotesType> = {
        FileName: fileName,
        Notes: notes,
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
      };
      faxNotesPost.mutate(faxNotesToPost, {
        onSuccess: () => {
          setNotesVisible(false);
        },
      });
    }
  };

  const handleCancel = () => {
    setNotesVisible(false);
  };

  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;
  return (
    <div className="fax-notes">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="fax-notes__text"
      />
      <div className="fax-notes__btn-container">
        <SaveButton onClick={handleSave} />
        <CancelButton onClick={handleCancel} />
      </div>
    </div>
  );
};

export default FaxNotes;
