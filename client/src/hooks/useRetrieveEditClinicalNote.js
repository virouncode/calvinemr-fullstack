import { useEffect, useState } from "react";
import { confirmAlert } from "../components/All/Confirm/ConfirmGlobal";

const useRetrieveEditClinicalNote = (
  patientId,
  fetchNextPage,
  clinicalNotes
) => {
  const [editClinicalNoteInMemory, setEditClinicalNoteInMemory] =
    useState(null);
  useEffect(() => {
    if (!clinicalNotes) return;
    const retrieveClinicalNote = async () => {
      if (
        localStorage.getItem("currentEditClinicalNote") &&
        JSON.parse(localStorage.getItem("currentEditClinicalNote"))
          .patient_id === patientId
      ) {
        if (
          await confirmAlert({
            content:
              "You were editing a clinical note about this patient, do you want to retrieve it ?",
          })
        ) {
          setEditClinicalNoteInMemory(
            JSON.parse(localStorage.getItem("currentEditClinicalNote"))
          );
          while (
            !clinicalNotes.pages
              .flatMap((page) => page.items)
              .find(
                ({ id }) =>
                  id ===
                  JSON.parse(localStorage.getItem("currentEditClinicalNote")).id
              )
          ) {
            await fetchNextPage();
          }
        } else {
          localStorage.removeItem("currentEditClinicalNote");
        }
      } else {
        setEditClinicalNoteInMemory(null);
      }
    };
    retrieveClinicalNote();
  }, [clinicalNotes, fetchNextPage, patientId]);

  return { editClinicalNoteInMemory, setEditClinicalNoteInMemory };
};

export default useRetrieveEditClinicalNote;
