import { Tooltip } from "@mui/material";
import { useState } from "react";

import useUserContext from "../../../../../../hooks/context/useUserContext";
import { useMedsTemplatePost } from "../../../../../../hooks/reactquery/mutations/medsTemplatesMutations";
import {
  dosageUnitCT,
  formCT,
  frequencyCT,
  routeCT,
  strengthUnitCT,
  ynIndicatorsimpleCT,
} from "../../../../../../omdDatas/codesTables";
import { nowTZTimestamp } from "../../../../../../utils/dates/formatDates";
import { toDurationText } from "../../../../../../utils/dates/toDurationText";
import { toPrescriptionInstructions } from "../../../../../../utils/medications/toPrescriptionInstructions";
import { medTemplateSchema } from "../../../../../../validation/record/medTemplateValidation";
import CancelButton from "../../../../../UI/Buttons/CancelButton";
import GenericCombo from "../../../../../UI/Lists/GenericCombo";
import GenericList from "../../../../../UI/Lists/GenericList";
import DurationPickerLong from "../../../../../UI/Pickers/DurationPickerLong";

const MedTemplateForm = ({ setNewVisible }) => {
  //HOOKS
  const { user } = useUserContext();
  const [formDatas, setFormDatas] = useState({
    DrugIdentificationNumber: "",
    DrugName: "",
    Strength: { Amount: "", UnitOfMeasure: "" },
    Dosage: "",
    DosageUnitOfMeasure: "",
    Form: "",
    Route: "",
    Frequency: "",
    Duration: "",
    duration: {
      Y: 0,
      M: 0,
      W: 0,
      D: 0,
    },
    RefillDuration: "",
    Quantity: "",
    RefillQuantity: "",
    NumberOfRefills: "",
    LongTermMedication: { ynIndicatorsimple: "N" },
    Notes: "",
    PrescriptionInstructions: "",
    SubstitutionNotAllowed: "N",
    refill_duration: {
      Y: 0,
      M: 0,
      W: 0,
      D: 0,
    },
  });
  const [errMsg, setErrMsg] = useState("");
  const [progress, setProgress] = useState(false);
  const medTemplatePost = useMedsTemplatePost();

  //HANDLERS
  const handleCancel = (e) => {
    e.preventDefault();
    setNewVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const templateToPost = {
      ...formDatas,
      author_id: user.id,
      date_created: nowTZTimestamp(),
      DrugName: formDatas.DrugName.toUpperCase(),
    };
    //Validation
    try {
      await medTemplateSchema.validate(templateToPost);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    //Submission
    setProgress(true);
    medTemplatePost.mutate(templateToPost, {
      onSuccess: () => {
        setNewVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  const handleChange = (e) => {
    setErrMsg("");
    let value = e.target.value;
    const name = e.target.name;
    switch (name) {
      case "Strength":
        setFormDatas({
          ...formDatas,
          Strength: { ...formDatas.Strength, Amount: value },
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName,
            value,
            formDatas.Strength.UnitOfMeasure,
            formDatas.SubstitutionNotAllowed,
            formDatas.Quantity,
            formDatas.Form,
            formDatas.Route,
            formDatas.Dosage,
            formDatas.DosageUnitOfMeasure,
            formDatas.Frequency,
            formDatas.Duration,
            formDatas.NumberOfRefills,
            formDatas.RefillQuantity,
            formDatas.RefillDuration
          ),
        });
        break;
      case "LongTermMedication":
        setFormDatas({
          ...formDatas,
          LongTermMedication: {
            ynIndicatorsimple: value,
          },
        });
        break;
      case "DrugName":
        setFormDatas({
          ...formDatas,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            value,
            formDatas.Strength.Amount,
            formDatas.Strength.UnitOfMeasure,
            formDatas.SubstitutionNotAllowed,
            formDatas.Quantity,
            formDatas.Form,
            formDatas.Route,
            formDatas.Dosage,
            formDatas.DosageUnitOfMeasure,
            formDatas.Frequency,
            formDatas.Duration,
            formDatas.NumberOfRefills,
            formDatas.RefillQuantity,
            formDatas.RefillDuration
          ),
        });
        break;
      case "Dosage":
        setFormDatas({
          ...formDatas,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName,
            formDatas.Strength.Amount,
            formDatas.Strength.UnitOfMeasure,
            formDatas.SubstitutionNotAllowed,
            formDatas.Quantity,
            formDatas.Form,
            formDatas.Route,
            value,
            formDatas.DosageUnitOfMeasure,
            formDatas.Frequency,
            formDatas.Duration,
            formDatas.NumberOfRefills,
            formDatas.RefillQuantity,
            formDatas.RefillDuration
          ),
        });
        break;
      case "SubstitutionNotAllowed":
        setFormDatas({
          ...formDatas,
          [name]: value === "Y" ? "N" : "Y",
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName,
            formDatas.Strength.Amount,
            formDatas.Strength.UnitOfMeasure,
            value === "Y" ? "N" : "Y",
            formDatas.Quantity,
            formDatas.Form,
            formDatas.Route,
            formDatas.Dosage,
            formDatas.DosageUnitOfMeasure,
            formDatas.Frequency,
            formDatas.Duration,
            formDatas.NumberOfRefills,
            formDatas.RefillQuantity,
            formDatas.RefillDuration
          ),
        });
        break;
      case "Quantity":
        setFormDatas({
          ...formDatas,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName,
            formDatas.Strength.Amount,
            formDatas.Strength.UnitOfMeasure,
            formDatas.SubstitutionNotAllowed,
            value,
            formDatas.Form,
            formDatas.Route,
            formDatas.Dosage,
            formDatas.DosageUnitOfMeasure,
            formDatas.Frequency,
            formDatas.Duration,
            formDatas.NumberOfRefills,
            formDatas.RefillQuantity,
            formDatas.RefillDuration
          ),
        });
        break;
      case "RefillQuantity":
        setFormDatas({
          ...formDatas,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName,
            formDatas.Strength.Amount,
            formDatas.Strength.UnitOfMeasure,
            formDatas.SubstitutionNotAllowed,
            formDatas.Quantity,
            formDatas.Form,
            formDatas.Route,
            formDatas.Dosage,
            formDatas.DosageUnitOfMeasure,
            formDatas.Frequency,
            formDatas.Duration,
            formDatas.NumberOfRefills,
            value,
            formDatas.RefillDuration
          ),
        });
        break;
      case "NumberOfRefills":
        setFormDatas({
          ...formDatas,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName,
            formDatas.Strength.Amount,
            formDatas.Strength.UnitOfMeasure,
            formDatas.SubstitutionNotAllowed,
            formDatas.Quantity,
            formDatas.Form,
            formDatas.Route,
            formDatas.Dosage,
            formDatas.DosageUnitOfMeasure,
            formDatas.Frequency,
            formDatas.Duration,
            value,
            formDatas.RefillQuantity,
            formDatas.RefillDuration
          ),
        });
        break;
      default:
        break;
    }
  };
  const handleDurationPickerChange = (e, type) => {
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      duration: {
        ...formDatas.duration,
        [type]: parseInt(value),
      },
      Duration: toDurationText(
        formDatas.duration.Y,
        formDatas.duration.M,
        formDatas.duration.W,
        formDatas.duration.D,
        type,
        parseInt(value)
      ),
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        formDatas.Strength.Amount,
        formDatas.Strength.UnitOfMeasure,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity,
        formDatas.Form,
        formDatas.Route,
        formDatas.Dosage,
        formDatas.DosageUnitOfMeasure,
        formDatas.Frequency,
        toDurationText(
          formDatas.duration.Y,
          formDatas.duration.M,
          formDatas.duration.W,
          formDatas.duration.D,
          type,
          parseInt(value)
        ),
        formDatas.NumberOfRefills,
        formDatas.RefillQuantity,
        formDatas.RefillDuration
      ),
    });
  };
  const handleRefillDurationPickerChange = (e, type) => {
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      refill_duration: {
        ...formDatas.refill_duration,
        [type]: parseInt(value),
      },
      RefillDuration: toDurationText(
        formDatas.refill_duration.Y,
        formDatas.refill_duration.M,
        formDatas.refill_duration.W,
        formDatas.refill_duration.D,
        type,
        parseInt(value)
      ),
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        formDatas.Strength.Amount,
        formDatas.Strength.UnitOfMeasure,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity,
        formDatas.Form,
        formDatas.Route,
        formDatas.Dosage,
        formDatas.DosageUnitOfMeasure,
        formDatas.Frequency,
        formDatas.Duration,
        formDatas.NumberOfRefills,
        formDatas.RefillQuantity,
        toDurationText(
          formDatas.refill_duration.Y,
          formDatas.refill_duration.M,
          formDatas.refill_duration.W,
          formDatas.refill_duration.D,
          type,
          parseInt(value)
        )
      ),
    });
  };
  const handleRouteChange = (value) => {
    setFormDatas({
      ...formDatas,
      Route: value,
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        formDatas.Strength.Amount,
        formDatas.Strength.UnitOfMeasure,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity,
        formDatas.Form,
        value,
        formDatas.Dosage,
        formDatas.DosageUnitOfMeasure,
        formDatas.Frequency,
        formDatas.Duration,
        formDatas.NumberOfRefills,
        formDatas.RefillQuantity,
        formDatas.RefillDuration
      ),
    });
  };
  const handleFrequencyChange = (value) => {
    setFormDatas({
      ...formDatas,
      Frequency: value,
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        formDatas.Strength.Amount,
        formDatas.Strength.UnitOfMeasure,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity,
        formDatas.Form,
        formDatas.Route,
        formDatas.Dosage,
        formDatas.DosageUnitOfMeasure,
        value,
        formDatas.Duration,
        formDatas.NumberOfRefills,
        formDatas.RefillQuantity,
        formDatas.RefillDuration
      ),
    });
  };
  const handleDosageUnitChange = (value) => {
    setFormDatas({
      ...formDatas,
      DosageUnitOfMeasure: value,
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        formDatas.Strength.Amount,
        formDatas.Strength.UnitOfMeasure,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity,
        formDatas.Form,
        formDatas.Route,
        formDatas.Dosage,
        value,
        formDatas.Frequency,
        formDatas.Duration,
        formDatas.NumberOfRefills,
        formDatas.RefillQuantity,
        formDatas.RefillDuration
      ),
    });
  };
  const handleStrengthUnitChange = (value) => {
    setFormDatas({
      ...formDatas,
      Strength: {
        ...formDatas.Strength,
        UnitOfMeasure: value,
      },
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        formDatas.Strength.Amount,
        value,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity,
        formDatas.Form,
        formDatas.Route,
        formDatas.Dosage,
        formDatas.DosageUnitOfMeasure,
        formDatas.Frequency,
        formDatas.Duration,
        formDatas.NumberOfRefills,
        formDatas.RefillQuantity,
        formDatas.RefillDuration
      ),
    });
  };
  const handleFormChange = (value) => {
    setFormDatas({
      ...formDatas,
      Form: value,
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName,
        formDatas.Strength.Amount,
        formDatas.Strength.UnitOfMeasure,
        formDatas.SubstitutionNotAllowed,
        formDatas.Quantity,
        value,
        formDatas.Route,
        formDatas.Dosage,
        formDatas.DosageUnitOfMeasure,
        formDatas.Frequency,
        formDatas.Duration,
        formDatas.NumberOfRefills,
        formDatas.RefillQuantity,
        formDatas.RefillDuration
      ),
    });
  };

  return (
    <div className="med-templates__form">
      {errMsg && <div className="med-templates__form-err">{errMsg}</div>}
      <div className="med-templates__form-row">
        <label htmlFor="med-template-drug-number">
          Drug identification number
        </label>
        <input
          name="DrugIdentificationNumber"
          type="text"
          value={formDatas.DrugIdentificationNumber}
          onChange={handleChange}
          autoComplete="off"
          id="med-template-drug-number"
        />
      </div>
      <div className="med-templates__form-row">
        <label htmlFor="med-template-drug-name">Drug name*</label>
        <input
          name="DrugName"
          type="text"
          value={formDatas.DrugName}
          onChange={handleChange}
          autoComplete="off"
          id="med-template-drug-name"
        />
      </div>
      <div className="med-templates__form-row">
        <label htmlFor="med-template-strength">Strength*</label>
        <input
          name="Strength"
          type="text"
          value={formDatas.Strength.Amount}
          onChange={handleChange}
          autoComplete="off"
          id="med-template-strength"
        />
      </div>
      <div className="med-templates__form-row">
        <label>Strength unit of measure*</label>
        <GenericCombo
          list={strengthUnitCT}
          value={formDatas.Strength.UnitOfMeasure}
          handleChange={handleStrengthUnitChange}
        />
      </div>
      <div className="med-templates__form-row">
        <label>Form*</label>
        <GenericCombo
          list={formCT}
          value={formDatas.Form}
          handleChange={handleFormChange}
        />
      </div>
      <div className="med-templates__form-row">
        <label htmlFor="med-template-dosage">Dosage*</label>
        <input
          name="Dosage"
          type="text"
          value={formDatas.Dosage}
          onChange={handleChange}
          autoComplete="off"
          id="med-template-dosage"
        />
      </div>
      <div className="med-templates__form-row">
        <label>Dosage unit of measure*</label>
        <GenericCombo
          list={dosageUnitCT}
          value={formDatas.DosageUnitOfMeasure}
          handleChange={handleDosageUnitChange}
        />
      </div>
      <div className="med-templates__form-row">
        <label>Route*</label>
        <GenericCombo
          list={routeCT}
          value={formDatas.Route}
          handleChange={handleRouteChange}
        />
      </div>
      <div className="med-templates__form-row">
        <label>Frequency*</label>
        <GenericCombo
          list={frequencyCT}
          value={formDatas.Frequency}
          handleChange={handleFrequencyChange}
        />
      </div>
      <div className="med-templates__form-row">
        <label>Duration*</label>
        <DurationPickerLong
          title={false}
          durationYears={formDatas.duration.Y}
          durationMonths={formDatas.duration.M}
          durationWeeks={formDatas.duration.W}
          durationDays={formDatas.duration.D}
          handleDurationPickerChange={handleDurationPickerChange}
        />
      </div>
      <div className="med-templates__form-row">
        <label htmlFor="med-template-quantity">Quantity</label>
        <input
          name="Quantity"
          type="text"
          value={formDatas.Quantity}
          onChange={handleChange}
          autoComplete="off"
          id="med-template-quantity"
        />
      </div>
      <div className="med-templates__form-row">
        <label>Refill duration</label>
        <DurationPickerLong
          title={false}
          durationYears={formDatas.refill_duration.Y}
          durationMonths={formDatas.refill_duration.M}
          durationWeeks={formDatas.refill_duration.W}
          durationDays={formDatas.refill_duration.D}
          handleDurationPickerChange={handleRefillDurationPickerChange}
        />
      </div>
      <div className="med-templates__form-row">
        <label htmlFor="med-template-refill-quantity">Refill quantity</label>
        <input
          name="RefillQuantity"
          type="text"
          value={formDatas.RefillQuantity}
          onChange={handleChange}
          autoComplete="off"
          id="med-template-refill-quantity"
        />
      </div>
      <div className="med-templates__form-row">
        <label htmlFor="med-template-nbr-refill">Number of refills</label>
        <input
          name="NumberOfRefills"
          type="text"
          value={formDatas.NumberOfRefills}
          onChange={handleChange}
          autoComplete="off"
          id="med-template-nbr-refill"
        />
      </div>
      <div className="med-templates__form-row">
        <label>Long-term medication*</label>
        <GenericList
          name="LongTermMedication"
          list={ynIndicatorsimpleCT}
          value={formDatas.LongTermMedication.ynIndicatorsimple}
          handleChange={handleChange}
          placeHolder="Choose..."
        />
      </div>
      <div className="med-templates__form-row">
        <label>Substitution allowed*</label>
        <GenericList
          name="SubstitutionNotAllowed"
          list={ynIndicatorsimpleCT}
          value={formDatas.SubstitutionNotAllowed === "Y" ? "N" : "Y"}
          handleChange={handleChange}
          placeHolder="Choose..."
        />
      </div>
      <div className="med-templates__form-row med-templates__form-row--text">
        <label htmlFor="med-template-notes">Notes</label>
        <textarea
          className="med-templates__form-notes"
          value={formDatas.Notes}
          onChange={handleChange}
          name="Notes"
          id="med-template-notes"
        />
      </div>
      <div className="med-templates__form-row med-templates__form-row--text">
        <Tooltip
          title="This is auto-generated, however you can edit the instructions in free text, but it is your responsibility to ensure that they do not contradict the rest of the form."
          placement="top-start"
          arrow
        >
          <label>Instructions*</label>
        </Tooltip>
        <textarea
          className="med-templates__form-instructions"
          value={formDatas.PrescriptionInstructions}
          onChange={handleChange}
          name="PrescriptionInstructions"
        />
      </div>
      <div className="med-templates__form-btn-container">
        <input
          type="submit"
          value="Save"
          disabled={progress}
          onClick={handleSubmit}
          className="save-btn"
        />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </div>
  );
};

export default MedTemplateForm;
