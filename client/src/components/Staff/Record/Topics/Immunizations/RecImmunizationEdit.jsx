import { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  routeCT,
  siteCT,
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
import SubmitButton from "../../../../UI/Buttons/SubmitButton";
import GenericCombo from "../../../../UI/Lists/GenericCombo";
import GenericList from "../../../../UI/Lists/GenericList";

const RecImmunizationEdit = ({
  immunizationInfos,
  type,
  setEditVisible,
  errMsgPost,
  setErrMsgPost,
  topicPut,
  topicDelete,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const [formDatas, setFormDatas] = useState(immunizationInfos);
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleCancel = () => {
    setEditVisible(false);
  };
  const handleDelete = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to remove this immunization ?",
      })
    ) {
      setProgress(true);
      topicDelete.mutate(immunizationInfos.id, {
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
      ...formDatas,
      ImmunizationName: firstLetterUpper(formDatas.ImmunizationName),
      Manufacturer: firstLetterUpper(formDatas.Manufacturer),
      updates: [
        ...immunizationInfos.updates,
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
        setEditVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };
  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    if (name === "RefusedFlag") {
      setFormDatas({
        ...formDatas,
        RefusedFlag: { ynIndicatorsimple: value },
      });
      return;
    }
    if (name === "Date") {
      value = value === "" ? null : dateISOToTimestampTZ(value);
    }
    setFormDatas({
      ...formDatas,
      [name]: value,
    });
  };
  const handleRouteChange = (value) => {
    setFormDatas({
      ...formDatas,
      Route: value,
    });
  };
  const handleSiteChange = (value) => {
    setFormDatas({
      ...formDatas,
      Site: value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="recimmunizations-form">
      {errMsgPost && <p className="immunizations__err">{errMsgPost}</p>}
      <div className="recimmunizations-form__row">
        <label>Immunization type: </label>
        <p>{type}</p>
      </div>
      <div className="recimmunizations-form__row">
        <label htmlFor="recimmunization-brand-name">
          Immunization brand name:{" "}
        </label>
        <input
          type="text"
          name="ImmunizationName"
          onChange={handleChange}
          value={formDatas.ImmunizationName}
          autoComplete="off"
          id="recimmunization-brand-name"
        />
      </div>
      <div className="recimmunizations-form__row">
        <label htmlFor="recimmunization-manufacturer">Manufacturer: </label>
        <input
          type="text"
          name="Manufacturer"
          onChange={handleChange}
          value={formDatas.Manufacturer}
          autoComplete="off"
          id="recimmunization-manufacturer"
        />
      </div>
      <div className="recimmunizations-form__row">
        <label htmlFor="recimmunization-lot">Lot#: </label>
        <input
          type="text"
          name="LotNumber"
          onChange={handleChange}
          value={formDatas.LotNumber}
          autoComplete="off"
          id="recimmunization-lot"
        />
      </div>
      <div className="recimmunizations-form__row">
        <label>Route: </label>
        <GenericCombo
          list={routeCT}
          value={formDatas.Route}
          handleChange={handleRouteChange}
        />
      </div>
      <div className="recimmunizations-form__row">
        <label>Site: </label>
        <GenericCombo
          list={siteCT}
          value={formDatas.Site}
          handleChange={handleSiteChange}
        />
      </div>
      <div className="recimmunizations-form__row">
        <label htmlFor="recimunization-dose">Dose: </label>
        <input
          type="text"
          name="Dose"
          onChange={handleChange}
          value={formDatas.Dose}
          autoComplete="off"
          id="recimunization-dose"
        />
      </div>
      <div className="recimmunizations-form__row">
        <label htmlFor="recimmunization-date">Date: </label>
        <input
          type="date"
          name="Date"
          onChange={handleChange}
          value={timestampToDateISOTZ(formDatas.Date)}
          autoComplete="off"
          id="recimmunization-date"
        />
      </div>
      <div className="recimmunizations-form__row">
        <label>Refused: </label>
        <GenericList
          list={ynIndicatorsimpleCT}
          name="RefusedFlag"
          handleChange={handleChange}
          value={formDatas.RefusedFlag.ynIndicatorsimple}
        />
      </div>
      <div className="recimmunizations-form__row recimmunizations-form__row--text">
        <label htmlFor="recimmunization-instructions">Instructions: </label>
        <textarea
          name="Instructions"
          onChange={handleChange}
          value={formDatas.Instructions}
          autoComplete="off"
          id="recimmunization-instructions"
        />
      </div>
      <div className="recimmunizations-form__row recimmunizations-form__row--text">
        <label htmlFor="recimmunization-notes">Notes: </label>
        <textarea
          name="Notes"
          onChange={handleChange}
          value={formDatas.Notes}
          autoComplete="off"
          id="recimmunization-notes"
        />
      </div>
      <div className="recimmunizations-form__btns">
        <SubmitButton label="Save" disabled={progress} />
        <DeleteButton onClick={handleDelete} disabled={progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </form>
  );
};

export default RecImmunizationEdit;
