import { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { lifeStageCT } from "../../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { problemListSchema } from "../../../../../validation/record/problemListValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import GenericList from "../../../../UI/Lists/GenericList";
import SignCell from "../../../../UI/Tables/SignCell";

const ProblemListItem = ({
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
    if (name === "OnsetDate" || name === "ResolutionDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const topicToPut = {
      ...itemInfos,
      ProblemDiagnosisDescription: firstLetterOfFirstWordUpper(
        itemInfos.ProblemDiagnosisDescription
      ),
      ProblemDescription: firstLetterOfFirstWordUpper(
        itemInfos.ProblemDescription
      ),
      ProblemStatus: firstLetterOfFirstWordUpper(itemInfos.ProblemStatus),
      Notes: firstLetterOfFirstWordUpper(itemInfos.Notes),
      updates: [
        ...itemInfos.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    //Validation
    try {
      await problemListSchema.validate(topicToPut);
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
        className="problemlist__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="problemlist__item-btn-container">
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
          {editVisible ? (
            <input
              name="ProblemDiagnosisDescription"
              type="text"
              value={itemInfos.ProblemDiagnosisDescription}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.ProblemDiagnosisDescription
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="ProblemDescription"
              type="text"
              value={itemInfos.ProblemDescription}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.ProblemDescription
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="ProblemStatus"
              type="text"
              value={itemInfos.ProblemStatus}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.ProblemStatus
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="OnsetDate"
              type="date"
              value={timestampToDateISOTZ(itemInfos.OnsetDate)}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            timestampToDateISOTZ(itemInfos.OnsetDate)
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericList
              list={lifeStageCT}
              value={itemInfos.LifeStage}
              name="LifeStage"
              handleChange={handleChange}
            />
          ) : (
            lifeStageCT.find(({ code }) => code === itemInfos.LifeStage)?.name
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="ResolutionDate"
              type="date"
              value={timestampToDateISOTZ(itemInfos.ResolutionDate)}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            timestampToDateISOTZ(itemInfos.ResolutionDate)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Notes"
              type="text"
              value={itemInfos.Notes}
              onChange={handleChange}
              autoComplete="off"
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

export default ProblemListItem;
