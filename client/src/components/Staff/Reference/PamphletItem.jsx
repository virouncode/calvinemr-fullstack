import { useEffect, useState } from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  usePamphletDelete,
  usePamphletPut,
} from "../../../hooks/reactquery/mutations/pamphletsMutations";
import { timestampToDateISOTZ } from "../../../utils/dates/formatDates";
import { showDocument } from "../../../utils/files/showDocument";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { pamphletSchema } from "../../../validation/reference/pamphletValidation";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import CancelButton from "../../UI/Buttons/CancelButton";
import DeleteButton from "../../UI/Buttons/DeleteButton";
import EditButton from "../../UI/Buttons/EditButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import InputTextToggle from "../../UI/Inputs/InputTextToggle";

const PamphletItem = ({
  item,
  setErrMsgPost,
  errMsgPost,
  lastItemRef = null,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [progress, setProgress] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState({});
  const pamphletPut = usePamphletPut();
  const pamphletDelete = usePamphletDelete();

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleEditClick = () => {
    setErrMsgPost("");
    setEditVisible(true);
  };
  const handleCancelClick = () => {
    setErrMsgPost("");
    setEditVisible(false);
  };
  const handleSaveClick = async () => {
    setErrMsgPost("");
    //Validation
    try {
      await pamphletSchema.validate(itemInfos);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    if (!itemInfos.file) {
      setErrMsgPost("Please upload a file");
      return;
    }
    setProgress(true);
    pamphletPut.mutate(itemInfos, {
      onSuccess: () => {
        setEditVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };
  const handleDeleteClick = async () => {
    setErrMsgPost("");
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      setProgress(true);
      pamphletDelete.mutate(item.id, {
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
    item && (
      <tr
        className="reference-edocs__item"
        style={{ border: errMsgPost && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="reference-edocs__item-btn-container">
            {editVisible ? (
              <>
                <SaveButton
                  onClick={handleSaveClick}
                  disabled={progress || item.created_by_id !== user.id}
                />
                <CancelButton
                  onClick={handleCancelClick}
                  disabled={progress || item.created_by_id !== user.id}
                />
              </>
            ) : (
              <>
                <EditButton
                  onClick={handleEditClick}
                  disabled={progress || item.created_by_id !== user.id}
                />
                <DeleteButton
                  onClick={handleDeleteClick}
                  disabled={progress || item.created_by_id !== user.id}
                />
              </>
            )}
          </div>
        </td>
        <td style={{ textAlign: "left" }}>
          <InputTextToggle
            value={itemInfos.name}
            onChange={handleChange}
            name="name"
            editVisible={editVisible}
          />
        </td>
        <td
          className="reference-edocs__item-link"
          onClick={() => showDocument(item.file?.url, item.file?.mime)}
        >
          {item.file.name}
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.notes}
            onChange={handleChange}
            name="notes"
            editVisible={editVisible}
          />
        </td>
        <td>{staffIdToTitleAndName(staffInfos, item.created_by_id)}</td>
        <td>{timestampToDateISOTZ(item.date_created)}</td>
      </tr>
    )
  );
};

export default PamphletItem;
