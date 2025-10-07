import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  dosageUnitCT,
  frequencyCT,
  strengthUnitCT,
  toCodeTableName,
} from "../../../../../omdDatas/codesTables";
import { MedType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { isMedicationActive } from "../../../../../utils/medications/isMedicationActive";
import Button from "../../../../UI/Buttons/Button";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import SignCell from "../../../../UI/Tables/SignCell";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import MedicationDetails from "./MedicationDetails";

type MedicationItemProps = {
  item: MedType;
  targetRef?: (node: Element | null) => void;
  topicDelete: UseMutationResult<void, Error, number, void>;
};

const MedicationItem = ({
  item,
  targetRef,
  topicDelete,
}: MedicationItemProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [detailVisible, setDetailVisible] = useState(false);

  //HANDLERS
  const handleDetailClick = () => {
    setDetailVisible((v) => !v);
  };

  const handleDeleteClick = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      topicDelete.mutate(item.id);
    }
  };

  return (
    item && (
      <>
        <tr
          className="medications__item"
          style={{
            backgroundColor: isMedicationActive(item.StartDate, item.duration)
              ? "#FEFEFE"
              : "#cecdcd",
          }}
          ref={targetRef}
        >
          <td>
            <div className="medications__item-btn-container">
              <Button onClick={handleDetailClick} label="Show" />
              {user.title === "Doctor" && (
                <DeleteButton onClick={handleDeleteClick} />
              )}
            </div>
          </td>
          <td>
            {isMedicationActive(item.StartDate, item.duration)
              ? "Active"
              : "Inactive"}
          </td>
          <td>{item.DrugName}</td>
          <td>
            {item.Strength.Amount}{" "}
            {toCodeTableName(strengthUnitCT, item.Strength.UnitOfMeasure) ||
              item.Strength.UnitOfMeasure}
          </td>
          <td>
            {item.Dosage}{" "}
            {toCodeTableName(dosageUnitCT, item.DosageUnitOfMeasure) ||
              item.DosageUnitOfMeasure}
          </td>
          <td>
            {toCodeTableName(frequencyCT, item.Frequency) || item.Frequency}
          </td>
          <td>{item.Duration}</td>
          <SignCell item={item} />
        </tr>
        {detailVisible && (
          <tr>
            <td>
              <FakeWindow
                title="MEDICATION DETAILS"
                width={600}
                height={750}
                x={(window.innerWidth - 600) / 2}
                y={(window.innerHeight - 750) / 2}
                color="#931621"
                setPopUpVisible={setDetailVisible}
              >
                <MedicationDetails item={item} />
              </FakeWindow>
            </td>
          </tr>
        )}
      </>
    )
  );
};

export default MedicationItem;
