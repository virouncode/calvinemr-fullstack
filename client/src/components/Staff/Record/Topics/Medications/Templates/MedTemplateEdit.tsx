import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMedsTemplatePut } from "../../../../../../hooks/reactquery/mutations/medsTemplatesMutations";
import {
  dosageUnitCT,
  formCT,
  frequencyCT,
  routeCT,
  strengthUnitCT,
  ynIndicatorsimpleCT,
} from "../../../../../../omdDatas/codesTables";
import { MedTemplateType } from "../../../../../../types/api";
import { toDurationText } from "../../../../../../utils/dates/toDurationText";
import { toPrescriptionInstructions } from "../../../../../../utils/medications/toPrescriptionInstructions";
import { medTemplateSchema } from "../../../../../../validation/record/medTemplateValidation";
import CancelButton from "../../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../../UI/Buttons/SaveButton";
import Input from "../../../../../UI/Inputs/Input";
import GenericCombo from "../../../../../UI/Lists/GenericCombo";
import GenericList from "../../../../../UI/Lists/GenericList";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import DurationPickerLong from "../../../../../UI/Pickers/DurationPickerLong";

type MedTemplateEditProps = {
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  med: MedTemplateType;
};

const MedTemplateEdit = ({ setEditVisible, med }: MedTemplateEditProps) => {
  //Hooks
  const [itemInfos, setItemInfos] = useState<MedTemplateType>(med);
  const [errMsg, setErrMsg] = useState("");
  const [progress, setProgress] = useState(false);
  //Queries
  const medTemplatePut = useMedsTemplatePut();

  useEffect(() => {
    setItemInfos(med);
  }, [med]);

  const handleCancel = () => {
    setEditVisible(false);
  };

  const handleSubmit = async () => {
    //Formatting
    const templateToPut: MedTemplateType = {
      ...itemInfos,
      DrugName: itemInfos.DrugName.toUpperCase(),
    };
    //Validation
    try {
      await medTemplateSchema.validate(templateToPut);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    //Submission
    setProgress(true);
    medTemplatePut.mutate(templateToPut, {
      onSuccess: () => {
        setEditVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    switch (name) {
      case "Strength":
        setItemInfos({
          ...itemInfos,
          Strength: {
            ...(itemInfos.Strength as { Amount: ""; UnitOfMeasure: "" }),
            Amount: value,
          },
          PrescriptionInstructions: toPrescriptionInstructions(
            itemInfos.DrugName,
            value,
            itemInfos.Strength.UnitOfMeasure,
            itemInfos.SubstitutionNotAllowed,
            itemInfos.Quantity,
            itemInfos.Form,
            itemInfos.Route,
            itemInfos.Dosage,
            itemInfos.DosageUnitOfMeasure,
            itemInfos.Frequency,
            itemInfos.Duration,
            itemInfos.NumberOfRefills,
            itemInfos.RefillQuantity,
            itemInfos.RefillDuration
          ),
        });
        break;
      case "LongTermMedication":
        setItemInfos({
          ...itemInfos,
          LongTermMedication: {
            ynIndicatorsimple: value,
          },
        });
        break;
      case "DrugIdentificationNumber":
        setItemInfos({
          ...itemInfos,
          [name]: value,
        });
        break;
      case "DrugName":
        setItemInfos({
          ...itemInfos,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            value,
            itemInfos.Strength.Amount,
            itemInfos.Strength.UnitOfMeasure,
            itemInfos.SubstitutionNotAllowed,
            itemInfos.Quantity,
            itemInfos.Form,
            itemInfos.Route,
            itemInfos.Dosage,
            itemInfos.DosageUnitOfMeasure,
            itemInfos.Frequency,
            itemInfos.Duration,
            itemInfos.NumberOfRefills,
            itemInfos.RefillQuantity,
            itemInfos.RefillDuration
          ),
        });
        break;
      case "Dosage":
        setItemInfos({
          ...itemInfos,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            itemInfos.DrugName,
            itemInfos.Strength.Amount,
            itemInfos.Strength.UnitOfMeasure,
            itemInfos.SubstitutionNotAllowed,
            itemInfos.Quantity,
            itemInfos.Form,
            itemInfos.Route,
            value,
            itemInfos.DosageUnitOfMeasure,
            itemInfos.Frequency,
            itemInfos.Duration,
            itemInfos.NumberOfRefills,
            itemInfos.RefillQuantity,
            itemInfos.RefillDuration
          ),
        });
        break;
      case "SubstitutionNotAllowed":
        setItemInfos({
          ...itemInfos,
          [name]: value === "Y" ? "N" : "Y",
          PrescriptionInstructions: toPrescriptionInstructions(
            itemInfos.DrugName,
            itemInfos.Strength.Amount,
            itemInfos.Strength.UnitOfMeasure,
            value === "Y" ? "N" : "Y",
            itemInfos.Quantity,
            itemInfos.Form,
            itemInfos.Route,
            itemInfos.Dosage,
            itemInfos.DosageUnitOfMeasure,
            itemInfos.Frequency,
            itemInfos.Duration,
            itemInfos.NumberOfRefills,
            itemInfos.RefillQuantity,
            itemInfos.RefillDuration
          ),
        });
        break;
      case "Quantity":
        setItemInfos({
          ...itemInfos,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            itemInfos.DrugName,
            itemInfos.Strength.Amount,
            itemInfos.Strength.UnitOfMeasure,
            itemInfos.SubstitutionNotAllowed,
            value,
            itemInfos.Form,
            itemInfos.Route,
            itemInfos.Dosage,
            itemInfos.DosageUnitOfMeasure,
            itemInfos.Frequency,
            itemInfos.Duration,
            itemInfos.NumberOfRefills,
            itemInfos.RefillQuantity,
            itemInfos.RefillDuration
          ),
        });
        break;
      case "RefillQuantity":
        setItemInfos({
          ...itemInfos,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            itemInfos.DrugName,
            itemInfos.Strength.Amount,
            itemInfos.Strength.UnitOfMeasure,
            itemInfos.SubstitutionNotAllowed,
            itemInfos.Quantity,
            itemInfos.Form,
            itemInfos.Route,
            itemInfos.Dosage,
            itemInfos.DosageUnitOfMeasure,
            itemInfos.Frequency,
            itemInfos.Duration,
            itemInfos.NumberOfRefills,
            value,
            itemInfos.RefillDuration
          ),
        });
        break;
      case "NumberOfRefills":
        setItemInfos({
          ...itemInfos,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            itemInfos.DrugName,
            itemInfos.Strength.Amount,
            itemInfos.Strength.UnitOfMeasure,
            itemInfos.SubstitutionNotAllowed,
            itemInfos.Quantity,
            itemInfos.Form,
            itemInfos.Route,
            itemInfos.Dosage,
            itemInfos.DosageUnitOfMeasure,
            itemInfos.Frequency,
            itemInfos.Duration,
            value,
            itemInfos.RefillQuantity,
            itemInfos.RefillDuration
          ),
        });
        break;
      default:
        setItemInfos({ ...itemInfos, [name]: value });
        break;
    }
  };

  const handleDurationPickerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "Y" | "M" | "W" | "D"
  ) => {
    const value = e.target.value;
    setItemInfos({
      ...itemInfos,
      duration: {
        ...(itemInfos.duration as {
          Y: number;
          M: number;
          W: number;
          D: number;
        }),
        [type]: parseInt(value),
      },
      Duration: toDurationText(
        itemInfos.duration.Y,
        itemInfos.duration.M,
        itemInfos.duration.W,
        itemInfos.duration.D,
        type,
        parseInt(value)
      ),
      PrescriptionInstructions: toPrescriptionInstructions(
        itemInfos.DrugName,
        itemInfos.Strength.Amount,
        itemInfos.Strength.UnitOfMeasure,
        itemInfos.SubstitutionNotAllowed,
        itemInfos.Quantity,
        itemInfos.Form,
        itemInfos.Route,
        itemInfos.Dosage,
        itemInfos.DosageUnitOfMeasure,
        itemInfos.Frequency,
        toDurationText(
          itemInfos.duration.Y,
          itemInfos.duration.M,
          itemInfos.duration.W,
          itemInfos.duration.D,
          type,
          parseInt(value)
        ),
        itemInfos.NumberOfRefills,
        itemInfos.RefillQuantity,
        itemInfos.RefillDuration
      ),
    });
  };

  const handleRefillDurationPickerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "Y" | "M" | "W" | "D"
  ) => {
    const value = e.target.value;
    setItemInfos({
      ...itemInfos,
      refill_duration: {
        ...(itemInfos.refill_duration as {
          Y: number;
          M: number;
          W: number;
          D: number;
        }),
        [type]: parseInt(value),
      },
      RefillDuration: toDurationText(
        itemInfos.refill_duration.Y,
        itemInfos.refill_duration.M,
        itemInfos.refill_duration.W,
        itemInfos.refill_duration.D,
        type,
        parseInt(value)
      ),
      PrescriptionInstructions: toPrescriptionInstructions(
        itemInfos.DrugName,
        itemInfos.Strength.Amount,
        itemInfos.Strength.UnitOfMeasure,
        itemInfos.SubstitutionNotAllowed,
        itemInfos.Quantity,
        itemInfos.Form,
        itemInfos.Route,
        itemInfos.Dosage,
        itemInfos.DosageUnitOfMeasure,
        itemInfos.Frequency,
        itemInfos.Duration,
        itemInfos.NumberOfRefills,
        itemInfos.RefillQuantity,
        toDurationText(
          itemInfos.refill_duration.Y,
          itemInfos.refill_duration.M,
          itemInfos.refill_duration.W,
          itemInfos.refill_duration.D,
          type,
          parseInt(value)
        )
      ),
    });
  };

  const handleRouteChange = (value: string) => {
    setItemInfos({
      ...itemInfos,
      Route: value,
      PrescriptionInstructions: toPrescriptionInstructions(
        itemInfos.DrugName,
        itemInfos.Strength.Amount,
        itemInfos.Strength.UnitOfMeasure,
        itemInfos.SubstitutionNotAllowed,
        itemInfos.Quantity,
        itemInfos.Form,
        value,
        itemInfos.Dosage,
        itemInfos.DosageUnitOfMeasure,
        itemInfos.Frequency,
        itemInfos.Duration,
        itemInfos.NumberOfRefills,
        itemInfos.RefillQuantity,
        itemInfos.RefillDuration
      ),
    });
  };
  const handleFrequencyChange = (value: string) => {
    setItemInfos({
      ...itemInfos,
      Frequency: value,
      PrescriptionInstructions: toPrescriptionInstructions(
        itemInfos.DrugName,
        itemInfos.Strength.Amount,
        itemInfos.Strength.UnitOfMeasure,
        itemInfos.SubstitutionNotAllowed,
        itemInfos.Quantity,
        itemInfos.Form,
        itemInfos.Route,
        itemInfos.Dosage,
        itemInfos.DosageUnitOfMeasure,
        value,
        itemInfos.Duration,
        itemInfos.NumberOfRefills,
        itemInfos.RefillQuantity,
        itemInfos.RefillDuration
      ),
    });
  };
  const handleDosageUnitChange = (value: string) => {
    setItemInfos({
      ...itemInfos,
      DosageUnitOfMeasure: value,
      PrescriptionInstructions: toPrescriptionInstructions(
        itemInfos.DrugName,
        itemInfos.Strength.Amount,
        itemInfos.Strength.UnitOfMeasure,
        itemInfos.SubstitutionNotAllowed,
        itemInfos.Quantity,
        itemInfos.Form,
        itemInfos.Route,
        itemInfos.Dosage,
        value,
        itemInfos.Frequency,
        itemInfos.Duration,
        itemInfos.NumberOfRefills,
        itemInfos.RefillQuantity,
        itemInfos.RefillDuration
      ),
    });
  };
  const handleStrengthUnitChange = (value: string) => {
    setItemInfos({
      ...itemInfos,
      Strength: {
        ...(itemInfos.Strength as { Amount: ""; UnitOfMeasure: "" }),
        UnitOfMeasure: value,
      },
      PrescriptionInstructions: toPrescriptionInstructions(
        itemInfos.DrugName,
        itemInfos.Strength.Amount,
        value,
        itemInfos.SubstitutionNotAllowed,
        itemInfos.Quantity,
        itemInfos.Form,
        itemInfos.Route,
        itemInfos.Dosage,
        itemInfos.DosageUnitOfMeasure,
        itemInfos.Frequency,
        itemInfos.Duration,
        itemInfos.NumberOfRefills,
        itemInfos.RefillQuantity,
        itemInfos.RefillDuration
      ),
    });
  };
  const handleFormChange = (value: string) => {
    setItemInfos({
      ...itemInfos,
      Form: value,
      PrescriptionInstructions: toPrescriptionInstructions(
        itemInfos.DrugName,
        itemInfos.Strength.Amount,
        itemInfos.Strength.UnitOfMeasure,
        itemInfos.SubstitutionNotAllowed,
        itemInfos.Quantity,
        value,
        itemInfos.Route,
        itemInfos.Dosage,
        itemInfos.DosageUnitOfMeasure,
        itemInfos.Frequency,
        itemInfos.Duration,
        itemInfos.NumberOfRefills,
        itemInfos.RefillQuantity,
        itemInfos.RefillDuration
      ),
    });
  };

  return (
    <div className="med-templates__form">
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <div className="med-templates__form-row">
        <Input
          label="Drug identification number"
          name="DrugIdentificationNumber"
          value={itemInfos.DrugIdentificationNumber}
          onChange={handleChange}
          id="med-template-drug-number"
        />
      </div>
      <div className="med-templates__form-row">
        <Input
          label="Drug name*"
          name="DrugName"
          value={itemInfos.DrugName}
          onChange={handleChange}
          id="med-template-drug-name"
        />
      </div>
      <div className="med-templates__form-row">
        <Input
          label="Strength*"
          name="Strength"
          value={itemInfos.Strength.Amount}
          onChange={handleChange}
          id="med-template-strength"
        />
      </div>
      <div className="med-templates__form-row">
        <GenericCombo
          list={strengthUnitCT}
          value={itemInfos.Strength.UnitOfMeasure}
          handleChange={handleStrengthUnitChange}
          label="Strength unit of measure*"
        />
      </div>
      <div className="med-templates__form-row">
        <GenericCombo
          list={formCT}
          value={itemInfos.Form}
          handleChange={handleFormChange}
          label="Form*"
        />
      </div>
      <div className="med-templates__form-row">
        <Input
          label="Dosage*"
          name="Dosage"
          value={itemInfos.Dosage}
          onChange={handleChange}
          id="med-template-dosage"
        />
      </div>
      <div className="med-templates__form-row">
        <GenericCombo
          list={dosageUnitCT}
          value={itemInfos.DosageUnitOfMeasure}
          handleChange={handleDosageUnitChange}
          label="Dosage unit of measure*"
        />
      </div>
      <div className="med-templates__form-row">
        <GenericCombo
          list={routeCT}
          value={itemInfos.Route}
          handleChange={handleRouteChange}
          label="Route*"
        />
      </div>
      <div className="med-templates__form-row">
        <GenericCombo
          list={frequencyCT}
          value={itemInfos.Frequency}
          handleChange={handleFrequencyChange}
          label="Frequency*"
        />
      </div>
      <div className="med-templates__form-row">
        <DurationPickerLong
          label="Duration"
          durationYears={itemInfos.duration.Y}
          durationMonths={itemInfos.duration.M}
          durationWeeks={itemInfos.duration.W}
          durationDays={itemInfos.duration.D}
          handleDurationPickerChange={handleDurationPickerChange}
        />
      </div>
      <div className="med-templates__form-row">
        <Input
          label="Quantity"
          name="Quantity"
          value={itemInfos.Quantity}
          onChange={handleChange}
          id="med-template-quantity"
        />
      </div>
      <div className="med-templates__form-row">
        <DurationPickerLong
          label="Refill duration"
          durationYears={itemInfos.refill_duration.Y}
          durationMonths={itemInfos.refill_duration.M}
          durationWeeks={itemInfos.refill_duration.W}
          durationDays={itemInfos.refill_duration.D}
          handleDurationPickerChange={handleRefillDurationPickerChange}
        />
      </div>
      <div className="med-templates__form-row">
        <Input
          label="Refill quantity"
          name="RefillQuantity"
          value={itemInfos.RefillQuantity}
          onChange={handleChange}
          id="med-template-refill-quantity"
        />
      </div>
      <div className="med-templates__form-row">
        <Input
          label="Number of refills"
          name="NumberOfRefills"
          value={itemInfos.NumberOfRefills}
          onChange={handleChange}
          id="med-template-nbr-refills"
        />
      </div>
      <div className="med-templates__form-row">
        <GenericList
          name="LongTermMedication"
          list={ynIndicatorsimpleCT}
          value={itemInfos.LongTermMedication.ynIndicatorsimple}
          handleChange={handleChange}
          placeHolder="Choose..."
          label="Long-term medication*"
        />
      </div>
      <div className="med-templates__form-row">
        <GenericList
          name="SubstitutionNotAllowed"
          list={ynIndicatorsimpleCT}
          value={itemInfos.SubstitutionNotAllowed === "Y" ? "N" : "Y"}
          handleChange={handleChange}
          placeHolder="Choose..."
          label="Substitution allowed*"
        />
      </div>
      <div className="med-templates__form-row med-templates__form-row--text">
        <label htmlFor="med-template-notes">Notes</label>
        <textarea
          className="med-templates__form-notes"
          value={itemInfos.Notes}
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
          <label htmlFor="med-template-instructions">Instructions*</label>
        </Tooltip>
        <textarea
          className="med-templates__form-instructions"
          value={itemInfos.PrescriptionInstructions}
          onChange={handleChange}
          name="PrescriptionInstructions"
          id="med-template-instructions"
        />
      </div>
      <div className="med-templates__form-btn-container">
        <SaveButton onClick={handleSubmit} disabled={progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </div>
  );
};

export default MedTemplateEdit;
