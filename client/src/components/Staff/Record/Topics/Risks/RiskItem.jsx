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
import { riskSchema } from "../../../../../validation/record/riskValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import GenericList from "../../../../UI/Lists/GenericList";
import SignCell from "../../../../UI/Tables/SignCell";

const RiskItem = ({
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
    if (name === "StartDate" || name === "EndDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const topicToPut = {
      ...itemInfos,
      RiskFactor: firstLetterOfFirstWordUpper(itemInfos.RiskFactor),
      ExposureDetails: firstLetterOfFirstWordUpper(itemInfos.ExposureDetails),
      Notes: firstLetterOfFirstWordUpper(itemInfos.Notes),
      updates: [
        ...itemInfos.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    //Validation
    try {
      await riskSchema.validate(topicToPut);
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
        className="risk__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="risk__item-btn-container">
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
              type="text"
              value={itemInfos.RiskFactor}
              onChange={handleChange}
              name="RiskFactor"
              autoComplete="off"
            />
          ) : (
            itemInfos.RiskFactor
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              value={itemInfos.ExposureDetails}
              onChange={handleChange}
              name="ExposureDetails"
              autoComplete="off"
            />
          ) : (
            itemInfos.ExposureDetails
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="date"
              max={timestampToDateISOTZ(nowTZTimestamp())}
              value={timestampToDateISOTZ(itemInfos.StartDate)}
              onChange={handleChange}
              name="StartDate"
              autoComplete="off"
            />
          ) : (
            timestampToDateISOTZ(itemInfos.StartDate)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="date"
              max={timestampToDateISOTZ(nowTZTimestamp())}
              value={timestampToDateISOTZ(itemInfos.EndDate)}
              onChange={handleChange}
              name="EndDate"
              autoComplete="off"
            />
          ) : (
            timestampToDateISOTZ(itemInfos.EndDate)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              value={itemInfos.AgeOfOnset}
              onChange={handleChange}
              name="AgeOfOnset"
              autoComplete="off"
            />
          ) : (
            itemInfos.AgeOfOnset
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
              value={itemInfos.Notes}
              onChange={handleChange}
              name="Notes"
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

export default RiskItem;
