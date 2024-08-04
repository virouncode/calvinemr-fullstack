import { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { alertSchema } from "../../../../../validation/record/alertValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import Button from "../../../../UI/Buttons/Button";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import SignCell from "../../../../UI/Tables/SignCell";

const AlertItem = ({
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
    if (name === "DateActive" || name === "EndDate") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const topicToPut = {
      ...itemInfos,
      AlertDescription: firstLetterOfFirstWordUpper(itemInfos.AlertDescription),
      updates: [
        ...itemInfos.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };

    //Validation
    try {
      await alertSchema.validate(topicToPut);
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
        className="alerts__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="alerts__item-btn-container">
            {!editVisible ? (
              <>
                <Button onClick={handleEditClick} />
                <Button onClick={handleDeleteClick} />
              </>
            ) : (
              <>
                <SaveButton
                  onClick={handleSubmit}
                  disabled={progress}
                  label="Save"
                />
                <CancelButton onClick={handleCancel} disabled={progress} />
              </>
            )}
          </div>
        </td>
        <td>
          {editVisible ? (
            <input
              name="AlertDescription"
              onChange={handleChange}
              type="text"
              value={itemInfos.AlertDescription}
              autoComplete="off"
            />
          ) : (
            itemInfos.AlertDescription
          )}
        </td>

        <td>
          {editVisible ? (
            <input
              name="DateActive"
              onChange={handleChange}
              type="date"
              value={timestampToDateISOTZ(
                itemInfos.DateActive,
                "America/Toronto"
              )}
              autoComplete="off"
            />
          ) : (
            timestampToDateISOTZ(itemInfos.DateActive, "America/Toronto")
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="EndDate"
              onChange={handleChange}
              type="date"
              value={timestampToDateISOTZ(itemInfos.EndDate, "America/Toronto")}
              autoComplete="off"
            />
          ) : (
            timestampToDateISOTZ(itemInfos.EndDate, "America/Toronto")
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Notes"
              onChange={handleChange}
              type="text"
              value={itemInfos.Notes}
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

export default AlertItem;
