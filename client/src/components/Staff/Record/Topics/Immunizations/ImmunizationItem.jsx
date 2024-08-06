import { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  immunizationTypeCT,
  routeCT,
  siteCT,
  toCodeTableName,
  ynIndicatorsimpleCT,
} from "../../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { immunizationSchema } from "../../../../../validation/record/immunizationValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import GenericCombo from "../../../../UI/Lists/GenericCombo";
import GenericList from "../../../../UI/Lists/GenericList";
import SignCell from "../../../../UI/Tables/SignCell";
import ImmunizationCombo from "./ImmunizationCombo";

const ImmunizationItem = ({
  item,
  setErrMsgPost,
  editCounter,
  topicPut,
  topicDelete,
}) => {
  const { user } = useUserContext();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(null);
  const [progress, setProgress] = useState(false);
  useEffect(() => {
    setItemInfos(item);
  }, [item]);

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "RefusedFlag") {
      setItemInfos({ ...itemInfos, RefusedFlag: { ynIndicatorsimple: value } });
      return;
    }
    if (name === "Date") {
      value = value ? dateISOToTimestampTZ(value) : null;
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleRouteChange = (value) => {
    setItemInfos({ ...itemInfos, Route: value });
  };
  const handleSiteChange = (value) => {
    setItemInfos({ ...itemInfos, Site: value });
  };
  const handleImmunizationChange = (value) => {
    setItemInfos({ ...itemInfos, ImmunizationType: value });
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
  const handleSubmit = async (e) => {
    setErrMsgPost("");
    e.preventDefault();
    //Formatting
    const topicToPut = {
      ...itemInfos,
      ImmunizationName: firstLetterUpper(itemInfos.ImmunizationName),
      Manufacturer: firstLetterUpper(itemInfos.Manufacturer),
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
      <tr className="immunizations__item">
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
          {editVisible ? (
            <input
              name="ImmunizationName"
              type="text"
              value={itemInfos.ImmunizationName}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.ImmunizationName
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Manufacturer"
              type="text"
              value={itemInfos.Manufacturer}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.Manufacturer
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="LotNumber"
              type="text"
              value={itemInfos.LotNumber}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.LotNumber
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericCombo
              list={routeCT}
              value={itemInfos.Route}
              handleChange={handleRouteChange}
            />
          ) : (
            item.Route
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
            item.Site
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Dose"
              type="text"
              value={itemInfos.Dose}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.Dose
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Date"
              type="date"
              value={timestampToDateISOTZ(itemInfos.Date)}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            timestampToDateISOTZ(item.Date)
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericList
              list={ynIndicatorsimpleCT}
              name="RefusedFlag"
              handleChange={handleChange}
              value={itemInfos.RefusedFlag.ynIndicatorsimple}
            />
          ) : (
            toCodeTableName(
              ynIndicatorsimpleCT,
              item.RefusedFlag.ynIndicatorsimple
            )
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Instructions"
              type="text"
              value={itemInfos.Instructions}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.Instructions
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
            item.Notes
          )}
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default ImmunizationItem;
