import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  immunizationTypeCT,
  routeCT,
  siteCT,
  ynIndicatorsimpleCT,
} from "../../../../../omdDatas/codesTables";
import { ImmunizationType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { immunizationSchema } from "../../../../../validation/record/immunizationValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import InputDateToggle from "../../../../UI/Inputs/InputDateToggle";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import GenericCombo from "../../../../UI/Lists/GenericCombo";
import GenericListToggle from "../../../../UI/Lists/GenericListToggle";
import SignCell from "../../../../UI/Tables/SignCell";
import ImmunizationCombo from "./ImmunizationCombo";

type ImmunizationItemProps = {
  item: ImmunizationType;
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  editCounter: React.MutableRefObject<number>;
  topicPut: UseMutationResult<ImmunizationType, Error, ImmunizationType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
  lastItemRef?: (node: Element | null) => void;
};

const ImmunizationItem = ({
  item,
  errMsgPost,
  setErrMsgPost,
  editCounter,
  topicPut,
  topicDelete,
  lastItemRef,
}: ImmunizationItemProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState<ImmunizationType | undefined>();
  const [progress, setProgress] = useState(false);
  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    let value: string | number | null = e.target.value;
    if (name === "RefusedFlag") {
      setItemInfos({
        ...(itemInfos as ImmunizationType),
        RefusedFlag: { ynIndicatorsimple: value },
      });
      return;
    }
    if (name === "Date") {
      value = dateISOToTimestampTZ(value);
    }
    setItemInfos({ ...(itemInfos as ImmunizationType), [name]: value });
  };

  const handleRouteChange = (value: string) => {
    setItemInfos({ ...(itemInfos as ImmunizationType), Route: value });
  };
  const handleSiteChange = (value: string) => {
    setItemInfos({ ...(itemInfos as ImmunizationType), Site: value });
  };
  const handleImmunizationChange = (value: string) => {
    setItemInfos({
      ...(itemInfos as ImmunizationType),
      ImmunizationType: value,
    });
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
    if (
      await confirmAlert({
        content: "Do you really want to remove this immunization ?",
      })
    ) {
      setProgress(true);
      topicDelete.mutate(item.id, {
        onSuccess: () => {
          setProgress(false);
          setEditVisible(false);
        },
        onError: () => {
          setProgress(false);
        },
      });
    }
  };
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setErrMsgPost("");
    e.preventDefault();
    //Formatting
    const topicToPut: ImmunizationType = {
      ...(itemInfos as ImmunizationType),
      ImmunizationName: firstLetterUpper(itemInfos?.ImmunizationName ?? ""),
      Manufacturer: firstLetterUpper(itemInfos?.Manufacturer ?? ""),
      updates: [
        ...item.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    //Validation
    try {
      await immunizationSchema.validate(topicToPut);
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

  return (
    itemInfos && (
      <tr
        className="immunizations__item"
        style={{ border: errMsgPost && editVisible ? "solid 1.5px red" : "" }}
        ref={lastItemRef}
      >
        <td>
          <div className="immunizations__item-btn-container">
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
        <td className="immunizations__item-type-list">
          {editVisible ? (
            <ImmunizationCombo
              list={immunizationTypeCT}
              value={itemInfos.ImmunizationType}
              handleChange={handleImmunizationChange}
            />
          ) : (
            item.ImmunizationType
          )}
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.ImmunizationName}
            onChange={handleChange}
            name="ImmunizationName"
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.Manufacturer}
            onChange={handleChange}
            name="Manufacturer"
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.LotNumber}
            onChange={handleChange}
            name="LotNumber"
            editVisible={editVisible}
          />
        </td>
        <td>
          {editVisible ? (
            <GenericCombo
              list={routeCT}
              value={itemInfos.Route}
              handleChange={handleRouteChange}
            />
          ) : (
            <p>{item.Route}</p>
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericCombo
              list={siteCT}
              value={itemInfos.Site}
              handleChange={handleSiteChange}
            />
          ) : (
            <p>{item.Site}</p>
          )}
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.Dose}
            onChange={handleChange}
            name="Dose"
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputDateToggle
            value={timestampToDateISOTZ(itemInfos.Date)}
            onChange={handleChange}
            name="Date"
            editVisible={editVisible}
          />
        </td>
        <td>
          <GenericListToggle
            list={ynIndicatorsimpleCT}
            name="RefusedFlag"
            handleChange={handleChange}
            value={itemInfos.RefusedFlag.ynIndicatorsimple}
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.Instructions}
            onChange={handleChange}
            name="Instructions"
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.Notes}
            onChange={handleChange}
            name="Notes"
            editVisible={editVisible}
          />
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default ImmunizationItem;
