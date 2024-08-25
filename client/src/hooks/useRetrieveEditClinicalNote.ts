import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { confirmAlert } from "../components/UI/Confirm/ConfirmGlobal";
import { ClinicalNoteType, XanoPaginatedType } from "../types/api";

const useRetrieveEditClinicalNote = (
  patientId: number,
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<ClinicalNoteType>, unknown>,
      Error
    >
  >,
  clinicalNotes:
    | InfiniteData<XanoPaginatedType<ClinicalNoteType>, unknown>
    | undefined
) => {
  const [editClinicalNoteInMemory, setEditClinicalNoteInMemory] =
    useState<ClinicalNoteType | null>(null);
  useEffect(() => {
    if (!clinicalNotes) return;
    const retrieveClinicalNote = async () => {
      if (localStorage.getItem("currentEditClinicalNote")) {
        if (
          JSON.parse(localStorage.getItem("currentEditClinicalNote") as string)
            .patient_id === patientId
        ) {
          if (
            await confirmAlert({
              content:
                "You were editing a clinical note about this patient, do you want to retrieve it ?",
            })
          ) {
            setEditClinicalNoteInMemory(
              JSON.parse(
                localStorage.getItem("currentEditClinicalNote") as string
              )
            );
            while (
              !clinicalNotes.pages
                .flatMap((page) => page.items)
                .find(
                  ({ id }) =>
                    id ===
                    JSON.parse(
                      localStorage.getItem("currentEditClinicalNote") as string
                    ).id
                )
            ) {
              await fetchNextPage();
            }
          } else {
            localStorage.removeItem("currentEditClinicalNote");
            setEditClinicalNoteInMemory(null);
          }
        } else {
          setEditClinicalNoteInMemory(null);
        }
      }
    };
    retrieveClinicalNote();
  }, [clinicalNotes, fetchNextPage, patientId]);

  return { editClinicalNoteInMemory, setEditClinicalNoteInMemory };
};

export default useRetrieveEditClinicalNote;
