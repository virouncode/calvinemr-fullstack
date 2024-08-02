import { useEffect, useState } from "react";
import { confirmAlert } from "../components/All/Confirm/ConfirmGlobal";

const useRetrieveNewClinicalNote = (patientId, setAddVisible) => {
  const [newClinicalNoteInMemory, setNewClinicalNoteInMemory] = useState(null);
  useEffect(() => {
    const retrieveClinicalNote = async () => {
      if (
        localStorage.getItem("currentNewClinicalNote") &&
        JSON.parse(localStorage.getItem("currentNewClinicalNote"))
          .patient_id === patientId
      ) {
        if (
          await confirmAlert({
            content:
              "You have an unsaved clinical note about this patient in memory, do you want to retrieve it ?",
          })
        ) {
          setNewClinicalNoteInMemory(
            JSON.parse(localStorage.getItem("currentNewClinicalNote"))
          );
          setAddVisible(true);
        } else {
          localStorage.removeItem("currentNewClinicalNote");
        }
      } else {
        setNewClinicalNoteInMemory(null);
      }
    };
    retrieveClinicalNote();
  }, [patientId, setAddVisible]);
  return { newClinicalNoteInMemory, setNewClinicalNoteInMemory };
};

export default useRetrieveNewClinicalNote;
