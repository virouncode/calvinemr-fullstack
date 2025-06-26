import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import xanoGet from "../../../../../api/xanoCRUD/xanoGet";
import xanoPut from "../../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { CareElementType, CycleType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import Button from "../../../../UI/Buttons/Button";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import PrintButton from "../../../../UI/Buttons/PrintButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import SignCell from "../../../../UI/Tables/SignCell";

type CycleItemProps = {
  item: CycleType;
  errMsgPost: string;
  lastItemRef?: (node: Element | null) => void;
  setCycleToShow: React.Dispatch<React.SetStateAction<CycleType | undefined>>;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setPrintVisible: React.Dispatch<React.SetStateAction<boolean>>;
  topicDelete: UseMutationResult<void, Error, number, void>;
  patientId: number;
};

const CycleItem = ({
  item,
  errMsgPost,
  lastItemRef,
  setCycleToShow,
  setShow,
  setPrintVisible,
  topicDelete,
  patientId,
}: CycleItemProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const [progress, setProgress] = useState(false);
  const handleClickShow = () => {
    setCycleToShow(item);
    setShow(true);
  };
  const handleClickPrint = () => {
    setCycleToShow(item);
    setPrintVisible((v) => !v);
  };

  const handleDeleteClick = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      setProgress(true);
      topicDelete.mutate(item.id, {
        onSuccess: async () => {
          try {
            // Récupérer les données CareElements après la suppression du cycle
            const careElementsDatas: CareElementType = (
              await xanoGet("/care_elements_of_patient", "staff", {
                patient_id: patientId,
                page: 1,
              })
            ).items?.[0];

            // Si des données CareElements existent pour ce patient
            if (careElementsDatas) {
              let hasChanges = false;

              // Parcourir tous les événements du cycle supprimé
              for (const event of item.events || []) {
                // Pour E2
                const e2Data = careElementsDatas?.E2.find(
                  (data: { Date: number }) => data.Date === event.date
                );

                if (e2Data) {
                  // Si une entrée E2 existe pour cette date, la supprimer
                  careElementsDatas.E2 = careElementsDatas.E2.filter(
                    (data: { Date: number }) => data.Date !== event.date
                  );
                  hasChanges = true;
                }

                // Pour LH
                const lhData = careElementsDatas?.LH.find(
                  (data: { Date: number }) => data.Date === event.date
                );

                if (lhData) {
                  // Si une entrée LH existe pour cette date, la supprimer
                  careElementsDatas.LH = careElementsDatas.LH.filter(
                    (data: { Date: number }) => data.Date !== event.date
                  );
                  hasChanges = true;
                }

                // Pour P4
                const p4Data = careElementsDatas?.P4.find(
                  (data: { Date: number }) => data.Date === event.date
                );

                if (p4Data) {
                  // Si une entrée P4 existe pour cette date, la supprimer
                  careElementsDatas.P4 = careElementsDatas.P4.filter(
                    (data: { Date: number }) => data.Date !== event.date
                  );
                  hasChanges = true;
                }
              }

              // Si des modifications ont été apportées, mettre à jour CareElements
              if (hasChanges) {
                const careElementsToPut = {
                  ...careElementsDatas,
                  updates: [
                    ...(careElementsDatas?.updates ?? []),
                    { updated_by_id: user.id, date_updated: nowTZTimestamp() },
                  ],
                };

                // Mettre à jour CareElements directement avec xanoPut
                await xanoPut(
                  `/care_elements/${careElementsDatas.id}`,
                  "staff",
                  careElementsToPut
                );

                // Émettre un message pour informer les autres composants de la mise à jour
                socket?.emit("message", { key: ["CARE ELEMENTS", patientId] });
              }
            }
          } catch (error) {
            console.error("Error updating CareElements:", error);
          }
        },
        onSettled: () => {
          setProgress(false);
        },
      });
    }
  };
  return (
    <tr
      className="cycles-item"
      style={{
        border: errMsgPost && "solid 1.5px red",
        backgroundColor: item.status === "Active" ? "#FEFEFE" : "#cecdcd",
      }}
      ref={lastItemRef}
    >
      <td>
        <div className="cycles-item__btn-container">
          <Button onClick={handleClickShow} label="Show" disabled={progress} />
          <PrintButton onClick={handleClickPrint} disabled={progress} />
          <DeleteButton
            onClick={handleDeleteClick}
            disabled={item.created_by_id !== user.id || progress}
          />
        </div>
      </td>
      <td>{item.status}</td>
      <td>{item.cycle_nbr}</td>
      <td>{timestampToDateISOTZ(item.lmp)}</td>
      <td>{item.cycle_type}</td>
      <td>{timestampToDateISOTZ(item.funded_billing_sent_at)}</td>
      <td>{timestampToDateISOTZ(item.funded_payment_received_at)}</td>
      <td>{timestampToDateISOTZ(item.non_funded_billing_sent_at)}</td>
      <td>{timestampToDateISOTZ(item.non_funded_payment_received_at)}</td>
      <SignCell item={item} />
    </tr>
  );
};

export default CycleItem;
