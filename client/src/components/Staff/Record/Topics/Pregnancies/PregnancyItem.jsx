import { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";
import { pregnancySchema } from "../../../../../validation/record/pregnancyValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import EditButton from "../../../../UI/Buttons/EditButton";
import SignCell from "../../../../UI/Tables/SignCell";
import PregnanciesList from "./PregnanciesList";

const PregnancyItem = ({
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
    if (name === "date_of_event") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    if (name === "term_nbr_of_weeks" || name === "term_nbr_of_days") {
      value = parseInt(value);
    }
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleChangePregnancyEvent = (value) => {
    setItemInfos({ ...itemInfos, description: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const topicToPut = {
      ...itemInfos,
      premises: firstLetterOfFirstWordUpper(itemInfos.premises),
      updates: [
        ...item.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
    };
    const datasForValidation = { ...itemInfos };
    if (datasForValidation.term_nbr_of_weeks === "") {
      datasForValidation.term_nbr_of_weeks = 0;
    }
    if (datasForValidation.term_nbr_of_days === "") {
      datasForValidation.term_nbr_of_days = 0;
    }
    try {
      await pregnancySchema.validate(datasForValidation);
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
        className="pregnancies-item"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
        ref={lastItemRef}
      >
        <td>
          <div className="pregnancies-item__btn-container">
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
            <PregnanciesList
              value={itemInfos.description}
              handleChange={handleChangePregnancyEvent}
            />
          ) : (
            itemInfos.description
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="date_of_event"
              type="date"
              value={timestampToDateISOTZ(itemInfos.date_of_event)}
              onChange={handleChange}
              className="pregnancies-item__input2"
            />
          ) : (
            timestampToDateISOTZ(itemInfos.date_of_event)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="premises"
              type="text"
              value={itemInfos.premises}
              onChange={handleChange}
              className="pregnancies-item__input1"
              autoComplete="off"
            />
          ) : (
            itemInfos.premises
          )}
        </td>
        <td>
          {editVisible ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%",
              }}
            >
              <input
                name="term_nbr_of_weeks"
                type="number"
                value={itemInfos.term_nbr_of_weeks}
                onChange={handleChange}
                className="pregnancies-item__input3"
                autoComplete="off"
              />
              w
              <input
                name="term_nbr_of_days"
                type="number"
                value={itemInfos.term_nbr_of_days}
                onChange={handleChange}
                className="pregnancies-item__input3"
                autoComplete="off"
              />
              d
            </div>
          ) : (
            <div>
              {itemInfos.term_nbr_of_weeks}w{itemInfos.term_nbr_of_days}d
            </div>
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="notes"
              type="text"
              value={itemInfos.notes}
              onChange={handleChange}
              className="pregnancies-item__input1"
              autoComplete="off"
            />
          ) : (
            itemInfos.notes
          )}
        </td>
        <SignCell item={item} />
      </tr>
    )
  );
};

export default PregnancyItem;
