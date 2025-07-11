import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import PatientChartHealthSearch from "../../../Billing/PatientChartHealthSearch";
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
}: RelationshipItemProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState<RelationshipType>(item);
  const [progress, setProgress] = useState(false);
  const [patientSearchVisible, setPatientSearchVisible] = useState(false);
  const [patientSelected, setPatientSelected] = useState<
    DemographicsType | undefined
  >();

  const fakewindowRoot = document.getElementById("fake-window");

  useEffect(() => {
    setItemInfos(item);
    setPatientSelected(item.relation_infos);
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
        ...(itemInfos.updates ?? []),
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
    if (inverseRelationToDeleteId) {
      await topicDelete.mutateAsync(inverseRelationToDeleteId);
    }

    await topicPut.mutateAsync(topicToPut);
    //Post the inverse relationship
    const gender = patientSelected?.Gender;
    const inverseRelationToPost: Partial<RelationshipType> = {
      patient_id: patientSelected?.patient_id,
      relationship: toInverseRelation(
        itemInfos.relationship,
        toCodeTableName(genderCT, gender)
      ),
      relation_id: itemInfos.patient_id,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };

    if (inverseRelationToPost.relationship !== "Undefined") {
      topicPost.mutate(inverseRelationToPost, {
        onSuccess: () => {
          editCounter.current -= 1;
          setEditVisible(false);
        },
        onSettled: () => {
          setProgress(false);
        },
      });
    }
  };

  const handleCancel = () => {
    editCounter.current -= 1;
    setErrMsgPost("");
    setItemInfos(item);
    setPatientSelected(item.relation_infos);
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
      try {
        if (relations.includes(itemInfos.relationship)) {
          const inverseRelationToDeleteId = (
            await xanoGet("/relationship_between", "staff", {
              patient_id: item.relation_id,
              relation_id: item.patient_id,
            })
          )[0].id;
          if (inverseRelationToDeleteId)
            await topicDelete.mutateAsync(inverseRelationToDeleteId);
        }
        topicDelete.mutate(item.id, {
          onSuccess: () => {
            setProgress(false);
          },
          onError: () => {
            setProgress(false);
          },
        });
      } catch (err) {
        if (err instanceof Error)
          setErrMsgPost(
            `An error occurred while deleting the relationship : ${err.message}`
          );
        setProgress(false);
      }
    }
  };
  const handleClickPatient = (patient: DemographicsType) => {
    setPatientSelected(patient);
    setPatientSearchVisible(false);
  };

  return (
    itemInfos && (
      <>
        <tr
          className="relationships__item"
          style={{ border: errMsgPost && editVisible ? "solid 1.5px red" : "" }}
          ref={lastItemRef}
        >
          <td>
            <div className="relationships__item-btn-container">
              {!editVisible ? (
                <>
                  <EditButton onClick={handleEditClick} disabled={progress} />
                  <DeleteButton
                    onClick={handleDeleteClick}
                    disabled={progress}
                  />
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
            <div className="relationships__item-relationship">
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
        {fakewindowRoot &&
          patientSearchVisible &&
          createPortal(
            <FakeWindow
              title="PATIENT SEARCH"
              width={800}
              height={600}
              x={(window.innerWidth - 800) / 2}
              y={(window.innerHeight - 600) / 2}
              color="#94bae8"
              setPopUpVisible={setPatientSearchVisible}
            >
              <PatientChartHealthSearch
                handleClickPatient={handleClickPatient}
              />
            </FakeWindow>,
            fakewindowRoot
          )}
      </>
    )
  );
};

export default RelationshipItem;
