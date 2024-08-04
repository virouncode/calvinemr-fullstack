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
  timestampMonthsLaterTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { immunizationSchema } from "../../../../../validation/record/immunizationValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SubmitButton from "../../../../UI/Buttons/SubmitButton";
import GenericCombo from "../../../../UI/Lists/GenericCombo";
import GenericList from "../../../../UI/Lists/GenericList";

const RecImmunizationFormSecondDose = ({
  setFormVisible,
  type,
  age,
  errMsgPost,
  setErrMsgPost,
  route,
  patientId,
  immunizationInfos,
  topicPost,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const [formDatas, setFormDatas] = useState({
    ImmunizationName: "",
    ImmunizationType: type,
    Manufacturer: "",
    LotNumber: "",
    Route: route,
    Site: "",
    Dose: "",
    Date: timestampMonthsLaterTZ(
      immunizationInfos.find(({ doseNumber }) => doseNumber === 1)?.Date,
      6
    ),
    RefusedFlag: { ynIndicatorsimple: "N" },
    Instructions: "",
    Notes: "",
    age: age,
    doseNumber: 2,
    patient_id: patientId,
    recommended: true,
  });
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleCancel = () => {
    setFormVisible(false);
  };
  const handleSubmit = async (e) => {
    setErrMsgPost("");
    e.preventDefault();
    //Formatting
    const topicToPost = {
      ...formDatas,
      ImmunizationName: firstLetterUpper(formDatas.ImmunizationName),
      Manufacturer: firstLetterUpper(formDatas.Manufacturer),
      patient_id: patientId,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await immunizationSchema.validate(topicToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    //Submission
    setProgress(true);
    topicPost.mutate(topicToPost, {
      onSuccess: () => {
        setFormVisible(false);
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
      value === "" ? (value = null) : (value = dateISOToTimestampTZ(value));
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
        <label htmlFor="recimmunization-dose">Dose: </label>
        <input
          type="text"
          name="Dose"
          onChange={handleChange}
          value={formDatas.Dose}
          autoComplete="off"
          id="recimmunization-dose"
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
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </form>
  );
};

export default RecImmunizationFormSecondDose;
