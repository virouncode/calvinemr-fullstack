import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { CycleType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
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
};

const CycleItem = ({
  item,
  errMsgPost,
  lastItemRef,
  setCycleToShow,
  setShow,
  setPrintVisible,
  topicDelete,
}: CycleItemProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
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
