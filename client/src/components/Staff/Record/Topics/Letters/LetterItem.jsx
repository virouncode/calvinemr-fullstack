import { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { showDocument } from "../../../../../utils/files/showDocument";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import Button from "../../../../UI/Buttons/Button";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import SignCell from "../../../../UI/Tables/SignCell";

const LetterItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  lastItemRef = null,
  topicPut,
  topicDelete,
  setFaxVisible,
  setFileToFax,
  setNewMessageExternalVisible,
  setNewMessageInternalVisible,
  setAttachmentsToSend,
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
    const topicToPut = {
      ...itemInfos,
      updates: [
        ...itemInfos.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };

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

  const handleFax = () => {
    setFileToFax({ alias: item.name, file: item.file });
    setFaxVisible(true);
  };
  const handleSendExternal = () => {
    setAttachmentsToSend([
      {
        file: item.file,
        alias: item.name,
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
        created_by_user_type: "staff",
      },
    ]);
    setNewMessageExternalVisible(true);
  };

  const handleSendInternal = () => {
    setAttachmentsToSend([
      {
        file: item.file,
        alias: item.name,
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
        created_by_user_type: "staff",
      },
    ]);
    setNewMessageInternalVisible(true);
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
    setEditVisible(true);
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
        className="letters__item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="letters__item-btn-container">
            {!editVisible ? (
              <>
                <EditButton onClick={handleEditClick} disabled={progress} />
                <Button
                  onClick={handleSendInternal}
                  disabled={progress}
                  label="Send (Internal)"
                />
                <Button
                  onClick={handleSendExternal}
                  disabled={progress}
                  label="Send (External)"
                />
                <Button onClick={handleFax} disabled={progress} label="Fax" />
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
          <InputTextToggle
            value={itemInfos.name}
            onChange={handleChange}
            name="name"
            editVisible={editVisible}
          />
        </td>
        <td>
          <span
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => showDocument(item.file?.url, "pdf")}
          >
            {item.file?.name}
          </span>
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.description}
            onChange={handleChange}
            name="description"
            editVisible={editVisible}
          />
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default LetterItem;
