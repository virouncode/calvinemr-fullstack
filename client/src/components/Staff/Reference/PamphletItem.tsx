import React, { useEffect, useState } from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  usePamphletDelete,
  usePamphletPut,
} from "../../../hooks/reactquery/mutations/pamphletsMutations";
import { PamphletType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { timestampToDateISOTZ } from "../../../utils/dates/formatDates";
import { showDocument } from "../../../utils/files/showDocument";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { pamphletSchema } from "../../../validation/reference/pamphletValidation";
import CancelButton from "../../UI/Buttons/CancelButton";
import DeleteButton from "../../UI/Buttons/DeleteButton";
import EditButton from "../../UI/Buttons/EditButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import InputTextToggle from "../../UI/Inputs/InputTextToggle";

type PamphletItemProps = {
  item: PamphletType;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  targetRef?: (node: Element | null) => void;
};

const PamphletItem = ({
  item,
  setErrMsgPost,
  errMsgPost,
  targetRef,
}: PamphletItemProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const [progress, setProgress] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState<PamphletType>(item);
  const pamphletPut = usePamphletPut();
  const pamphletDelete = usePamphletDelete();

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    setItemInfos({ ...(itemInfos as PamphletType), [name]: value });
  };

  const handleEditClick = () => {
    setErrMsgPost("");
    setEditVisible(true);
  };
  const handleCancelClick = () => {
    setErrMsgPost("");
    setItemInfos(item);
    setEditVisible(false);
  };
  const handleSaveClick = async () => {
    setErrMsgPost("");
    if (!itemInfos.file) {
      setErrMsgPost("Please upload a file");
      return;
    }
    //Validation
    try {
      await pamphletSchema.validate(itemInfos);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
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
        className="reference__edocs-item"
        style={{ border: errMsgPost && "solid 1.5px red" }}
        ref={targetRef}
      >
        <td>
          <div className="reference__edocs-item-btn-container">
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
          className="reference__edocs-item-link"
          onClick={() => showDocument(item.file?.url, item.file?.mime)}
        >
          {item.file?.name}
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
