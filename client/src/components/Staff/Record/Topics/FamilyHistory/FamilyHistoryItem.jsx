import { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  lifeStageCT,
  toCodeTableName,
} from "../../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { famHistorySchema } from "../../../../../validation/record/famHistoryValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import GenericList from "../../../../UI/Lists/GenericList";
import SignCell from "../../../../UI/Tables/SignCell";
import RelativesList from "./RelativesList";

const FamilyHistoryItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  lastItemRef = null,
  topicPut,
  topicDelete,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(null);
  const [progress, setProgress] = useState(false);
  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "StartDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const topicToPut = {
      ...itemInfos,
      ProblemDiagnosisProcedureDescription: firstLetterOfFirstWordUpper(
        itemInfos.ProblemDiagnosisProcedureDescription
      ),
      Treatment: firstLetterOfFirstWordUpper(itemInfos.Treatment),
      Notes: firstLetterOfFirstWordUpper(itemInfos.Notes),
      updates: [
        ...itemInfos.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };

    //Validation
    try {
      await famHistorySchema.validate(topicToPut);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    setProgress(true);
    topicPut.mutate(topicToPut, {
      onSuccess: () => {
        editCounter.current -= 1;
        setEditVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setItemInfos(item);
    setEditVisible(false);
  };

  const handleMemberChange = (value) => {
    setItemInfos({ ...itemInfos, Relationship: value });
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
        className="famhistory__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="famhistory__item-btn-container">
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
          {editVisible ? (
            <input
              name="ProblemDiagnosisProcedureDescription"
              type="text"
              value={itemInfos.ProblemDiagnosisProcedureDescription}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.ProblemDiagnosisProcedureDescription
          )}
        </td>
        <td>
          {editVisible ? (
            <RelativesList
              handleChange={handleMemberChange}
              value={itemInfos.Relationship}
            />
          ) : (
            itemInfos.Relationship
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="date"
              max={timestampToDateISOTZ(nowTZTimestamp())}
              name="StartDate"
              value={timestampToDateISOTZ(itemInfos.StartDate)}
              onChange={handleChange}
            />
          ) : (
            timestampToDateISOTZ(itemInfos.StartDate)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="AgeAtOnset"
              value={itemInfos.AgeAtOnset}
              onChange={handleChange}
            />
          ) : (
            itemInfos.AgeAtOnset
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericList
              list={lifeStageCT}
              value={itemInfos.LifeStage}
              name="LifeStage"
              handleChange={handleChange}
              placeHolder="Choose a lifestage..."
              noneOption={false}
            />
          ) : (
            toCodeTableName(lifeStageCT, itemInfos.LifeStage)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="Treatment"
              value={itemInfos.Treatment}
              onChange={handleChange}
            />
          ) : (
            itemInfos.Treatment
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="Notes"
              value={itemInfos.Notes}
              onChange={handleChange}
            />
          ) : (
            itemInfos.Notes
          )}
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default FamilyHistoryItem;
