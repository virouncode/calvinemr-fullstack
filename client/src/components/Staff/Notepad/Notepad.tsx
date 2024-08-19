import React, { useEffect, useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useNotepadPut } from "../../../hooks/reactquery/mutations/notepadMutations";
import { useNotepad } from "../../../hooks/reactquery/queries/notepadQueries";
import { NotepadType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import CloseButton from "../../UI/Buttons/CloseButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import CircularProgressSmall from "../../UI/Progress/CircularProgressSmall";

type NotepadProps = {
  setNotepadVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const Notepad = ({ setNotepadVisible }: NotepadProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [notes, setNotes] = useState("");
  const { data, isPending, error } = useNotepad(user.id);
  const [progress, setProgress] = useState(false);
  const notepadPut = useNotepadPut(user.id);

  useEffect(() => {
    if (!data || isPending) return;
    setNotes(data.notes);
  }, [data, isPending]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  const handleClose = async () => {
    if (
      data?.notes === notes ||
      (data?.notes !== notes &&
        (await confirmAlert({
          content:
            "Do you really want to close the notepad ? Your changes will be lost",
        })))
    ) {
      setNotepadVisible(false);
    }
  };
  const handleSave = async () => {
    setProgress(true);
    const notepadToPut: NotepadType = { ...(data as NotepadType), notes };
    notepadPut.mutate(notepadToPut, {
      onSuccess: () => {
        setNotepadVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  if (isPending)
    return (
      <div className="notepad">
        <LoadingParagraph />
      </div>
    );
  if (error)
    return (
      <div className="notepad">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  return (
    <div className="notepad">
      <textarea
        className="notepad__notes"
        value={notes}
        onChange={handleChange}
        autoFocus
        autoComplete="off"
      />
      <div className="notepad__btns">
        <SaveButton onClick={handleSave} disabled={progress} />
        <CloseButton onClick={handleClose} disabled={progress} />
        {progress && <CircularProgressSmall />}
      </div>
    </div>
  );
};

export default Notepad;
