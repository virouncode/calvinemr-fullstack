import React, { useEffect, useState } from "react";
import { confirmAlert } from "../components/UI/Confirm/ConfirmGlobal";
import { ClinicalNoteFormType } from "../types/api";

const useRetrieveNewClinicalNote = (
  patientId: number,
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [newClinicalNoteInMemory, setNewClinicalNoteInMemory] =
    useState<ClinicalNoteFormType | null>(null);
  useEffect(() => {
    const retrieveClinicalNote = async () => {
      if (localStorage.getItem("currentNewClinicalNote")) {
        if (
          JSON.parse(localStorage.getItem("currentNewClinicalNote") as string)
            .patient_id === patientId
        ) {
          if (
            await confirmAlert({
              content:
                "You have an unsaved clinical note about this patient in memory, do you want to retrieve it ?",
            })
          ) {
            setNewClinicalNoteInMemory(
              JSON.parse(
                localStorage.getItem("currentNewClinicalNote") as string
              )
            );
            setAddVisible(true);
          } else {
            localStorage.removeItem("currentNewClinicalNote");
          }
        } else {
          setNewClinicalNoteInMemory(null);
        }
      }
    };
    retrieveClinicalNote();
  }, [patientId, setAddVisible]);
  return { newClinicalNoteInMemory, setNewClinicalNoteInMemory };
};

export default useRetrieveNewClinicalNote;
