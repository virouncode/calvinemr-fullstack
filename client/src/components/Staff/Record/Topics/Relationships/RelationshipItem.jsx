import { useEffect, useState } from "react";
import "react-widgets/scss/styles.scss";

import xanoGet from "../../../../../api/xanoCRUD/xanoGet";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { genderCT, toCodeTableName } from "../../../../../omdDatas/codesTables";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import { relations } from "../../../../../utils/relationships/relations";
import { toInverseRelation } from "../../../../../utils/relationships/toInverseRelation";
import { relationshipSchema } from "../../../../../validation/record/relationshipValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import SignCell from "../../../../UI/Tables/SignCell";
import RelationshipList from "./RelationshipList";

const RelationshipItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  patientId,
  lastItemRef = null,
  topicPost,
  topicPut,
  topicDelete,
  setPatientSelected,
  patientSelected,
  setPatientSearchVisible,
}) => {
  const { user } = useUserContext();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(null);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setItemInfos(item);
    setPatientSelected(item.relation_infos);
  }, [item, setPatientSelected]);

  //HANDLERS
  const handleRelationshipChange = (value, itemId) => {
    setErrMsgPost("");
    setItemInfos({ ...itemInfos, relationship: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const topicToPut = {
      ...itemInfos,
      relation_id: patientSelected?.patient_id,
      updates: [
        ...itemInfos.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    //Validation
    try {
      await relationshipSchema.validate(topicToPut);
    } catch (err) {
      setErrMsgPost(err.message);
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
    let inverseRelationToPost = {};
    inverseRelationToPost.patient_id = patientSelected.patient_id;
    const gender = patientSelected.Gender;
    inverseRelationToPost.relationship = toInverseRelation(
      itemInfos.relationship,
      toCodeTableName(genderCT, gender)
    );
    inverseRelationToPost.relation_id = itemInfos.patient_id;
    inverseRelationToPost.date_created = nowTZTimestamp();
    inverseRelationToPost.created_by_id = user.id;

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

  const handleCancel = (e) => {
    e.preventDefault();
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

  const handleDeleteClick = async (e) => {
    setErrMsgPost("");
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      setProgress(true);
      if (relations.includes(itemInfos.relationship)) {
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
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
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
                <input
                  type="submit"
                  value="Save"
                  onClick={handleSubmit}
                  disabled={progress}
                />
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
              <input
                type="text"
                value={toPatientName(patientSelected)}
                name="patient_id"
                readOnly
                style={{ outline: "solid 1px grey" }}
              />
              <i
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  right: "17px",
                  top: "17px",
                }}
                className="fa-solid fa-magnifying-glass"
                onClick={() => setPatientSearchVisible(true)}
              />
            </>
          ) : (
            toPatientName(itemInfos.relation_infos)
          )}
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default RelationshipItem;
