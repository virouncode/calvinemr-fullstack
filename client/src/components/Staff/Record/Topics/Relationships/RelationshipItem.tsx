import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import "react-widgets/scss/styles.scss";
import xanoGet from "../../../../../api/xanoCRUD/xanoGet";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { genderCT, toCodeTableName } from "../../../../../omdDatas/codesTables";
import { DemographicsType, RelationshipType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import { relations } from "../../../../../utils/relationships/relations";
import { toInverseRelation } from "../../../../../utils/relationships/toInverseRelation";
import { relationshipSchema } from "../../../../../validation/record/relationshipValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import InputWithSearchInTable from "../../../../UI/Inputs/InputWithSearchInTable";
import SignCell from "../../../../UI/Tables/SignCell";
import RelationshipList from "./RelationshipList";

type RelationshipItemProps = {
  item: RelationshipType;
  editCounter: React.MutableRefObject<number>;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  lastItemRef?: (node: Element | null) => void;
  topicPost: UseMutationResult<
    RelationshipType,
    Error,
    Partial<RelationshipType>,
    void
  >;
  topicPut: UseMutationResult<RelationshipType, Error, RelationshipType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
  setPatientSelected: React.Dispatch<
    React.SetStateAction<DemographicsType | undefined>
  >;
  patientSelected: DemographicsType | undefined;
  setPatientSearchVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const RelationshipItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  lastItemRef,
  topicPost,
  topicPut,
  topicDelete,
  setPatientSelected,
  patientSelected,
  setPatientSearchVisible,
}: RelationshipItemProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState<RelationshipType | undefined>();
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setItemInfos(item);
    setPatientSelected(item.relation_infos as DemographicsType);
  }, [item, setPatientSelected]);

  //HANDLERS
  const handleRelationshipChange = (value: string) => {
    setErrMsgPost("");
    setItemInfos({ ...(itemInfos as RelationshipType), relationship: value });
  };

  const handleSubmit = async () => {
    const topicToPut: RelationshipType = {
      ...(itemInfos as RelationshipType),
      relation_id: patientSelected?.patient_id ?? 0,
      updates: [
        ...(itemInfos?.updates ?? []),
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    //Validation
    try {
      await relationshipSchema.validate(topicToPut);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }

    //Submission
    setProgress(true);
    //Delete the inverse relation ship of item
    const inverseRelationToDeleteId = (
      await xanoGet("/relationship_between", "staff", {
        patient_id: item.relation_id,
        relation_id: item.patient_id,
      })
    )[0].id;

    topicDelete.mutate(inverseRelationToDeleteId);
    topicPut.mutate(topicToPut);
    //Post the inverse relationship
    const gender = patientSelected?.Gender;
    const inverseRelationToPost: Partial<RelationshipType> = {
      patient_id: patientSelected?.patient_id,
      relationship: toInverseRelation(
        itemInfos?.relationship ?? "",
        toCodeTableName(genderCT, gender)
      ),
      relation_id: itemInfos?.patient_id,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };

    if (inverseRelationToPost.relationship !== "Undefined") {
      topicPost.mutate(inverseRelationToPost, {
        onSuccess: () => {
          editCounter.current -= 1;
          setEditVisible(false);
          setProgress(false);
        },
        onError: () => {
          setProgress(false);
        },
      });
    }
  };

  const handleCancel = () => {
    editCounter.current -= 1;
    setErrMsgPost("");
    setItemInfos(item);
    setEditVisible(false);
  };

  const handleEditClick = () => {
    editCounter.current += 1;
    setErrMsgPost("");
    setEditVisible((v) => !v);
  };

  const handleDeleteClick = async () => {
    setErrMsgPost("");
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      setProgress(true);
      if (relations.includes(itemInfos?.relationship ?? "")) {
        const inverseRelationToDeleteId = (
          await xanoGet("/relationship_between", "staff", {
            patient_id: item.relation_id,
            relation_id: item.patient_id,
          })
        )[0].id;
        topicDelete.mutate(inverseRelationToDeleteId);
      }
      topicDelete.mutate(item.id, {
        onSuccess: () => {
          setProgress(false);
        },
        onError: () => {
          setProgress(false);
        },
      });
    }
  };

  return (
    itemInfos && (
      <tr
        className="relationships-item"
        style={{ border: errMsgPost && editVisible ? "solid 1.5px red" : "" }}
        ref={lastItemRef}
      >
        <td>
          <div className="relationships-item__btn-container">
            {!editVisible ? (
              <>
                <EditButton onClick={handleEditClick} disabled={progress} />
                <DeleteButton onClick={handleDeleteClick} disabled={progress} />
              </>
            ) : (
              <>
                <SaveButton onClick={handleSubmit} disabled={progress} />
                <CancelButton onClick={handleCancel} disabled={progress} />
              </>
            )}
          </div>
        </td>
        <td>
          <div className="relationships-item__relationship">
            {editVisible ? (
              <RelationshipList
                value={itemInfos.relationship}
                handleChange={handleRelationshipChange}
              />
            ) : (
              itemInfos.relationship
            )}
            <span>of</span>
          </div>
        </td>
        <td style={{ position: "relative" }}>
          {editVisible ? (
            <>
              <InputWithSearchInTable
                name="patient_id"
                value={toPatientName(patientSelected)}
                readOnly={true}
                onClick={() => setPatientSearchVisible(true)}
              />
            </>
          ) : (
            <p>{toPatientName(itemInfos.relation_infos)}</p>
          )}
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default RelationshipItem;
