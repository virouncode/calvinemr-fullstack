import { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { reminderSchema } from "../../../../../validation/record/reminderValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import SignCell from "../../../../UI/Tables/SignCell";

const ReminderItem = ({
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
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const topicToPut = {
      ...itemInfos,
      reminder: firstLetterOfFirstWordUpper(itemInfos.reminder),
      updates: [
        ...itemInfos.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    //Validation
    try {
      await reminderSchema.validate(topicToPut);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
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
        className="reminders__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="reminders__item-btn-container">
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
              type="text"
              value={itemInfos.reminder}
              name="reminder"
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            itemInfos.reminder
          )}
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default ReminderItem;
