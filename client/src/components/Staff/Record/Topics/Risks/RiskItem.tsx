import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { lifeStageCT } from "../../../../../omdDatas/codesTables";
import { RiskFactorType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { riskSchema } from "../../../../../validation/record/riskValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import InputDateToggle from "../../../../UI/Inputs/InputDateToggle";
import InputTextToggle from "../../../../UI/Inputs/InputTextToggle";
import GenericListToggle from "../../../../UI/Lists/GenericListToggle";
import SignCell from "../../../../UI/Tables/SignCell";

type RiskItemProps = {
  item: RiskFactorType;
  editCounter: React.MutableRefObject<number>;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  lastItemRef?: (node: Element | null) => void;
  topicPut: UseMutationResult<RiskFactorType, Error, RiskFactorType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
};

const RiskItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  lastItemRef,
  topicPut,
  topicDelete,
}: RiskItemProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState<RiskFactorType | undefined>();
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  //HANDLERS
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setErrMsgPost("");
    const name = e.target.name;
    let value: string | number | null = e.target.value;
    if (name === "StartDate" || name === "EndDate") {
      value = dateISOToTimestampTZ(value);
    }
    setItemInfos({ ...(itemInfos as RiskFactorType), [name]: value });
  };

  const handleSubmit = async () => {
    //Formatting
    const topicToPut: RiskFactorType = {
      ...(itemInfos as RiskFactorType),
      RiskFactor: firstLetterOfFirstWordUpper(itemInfos?.RiskFactor ?? ""),
      ExposureDetails: firstLetterOfFirstWordUpper(
        itemInfos?.ExposureDetails ?? ""
      ),
      Notes: firstLetterOfFirstWordUpper(itemInfos?.Notes ?? ""),
      updates: [
        ...(itemInfos?.updates ?? []),
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    //Validation
    try {
      await riskSchema.validate(topicToPut);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    //Submission
    setProgress(true);
    topicPut.mutate(topicToPut, {
      onSuccess: () => {
        editCounter.current -= 1;
        setEditVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  const handleCancel = () => {
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
        style={{ border: errMsgPost && editVisible ? "solid 1.5px red" : "" }}
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
                <SaveButton onClick={handleSubmit} disabled={progress} />
                <CancelButton onClick={handleCancel} disabled={progress} />
              </>
            )}
          </div>
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.RiskFactor}
            onChange={handleChange}
            name="RiskFactor"
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.ExposureDetails}
            onChange={handleChange}
            name="ExposureDetails"
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputDateToggle
            max={timestampToDateISOTZ(nowTZTimestamp())}
            value={timestampToDateISOTZ(itemInfos.StartDate)}
            onChange={handleChange}
            name="StartDate"
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputDateToggle
            max={timestampToDateISOTZ(nowTZTimestamp())}
            value={timestampToDateISOTZ(itemInfos.EndDate)}
            onChange={handleChange}
            name="EndDate"
            editVisible={editVisible}
          />
        </td>
        <td>
          <InputTextToggle
            value={itemInfos.AgeOfOnset}
            onChange={handleChange}
            name="AgeOfOnset"
            editVisible={editVisible}
          />
        </td>
        <td>
          <GenericListToggle
            list={lifeStageCT}
            value={itemInfos.LifeStage}
            name="LifeStage"
            handleChange={handleChange}
            placeHolder="Choose a lifestage..."
            noneOption={false}
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

export default RiskItem;
