import { Tooltip } from "@mui/material";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useMedsTemplatePost } from "../../../../../hooks/reactquery/mutations/medsTemplatesMutations";
import { useTopicPost } from "../../../../../hooks/reactquery/mutations/topicMutations";
import { useMedsTemplates } from "../../../../../hooks/reactquery/queries/medsTemplatesQueries";
import {
  dosageUnitCT,
  formCT,
  frequencyCT,
  routeCT,
  strengthUnitCT,
  ynIndicatorsimpleCT,
} from "../../../../../omdDatas/codesTables";
import {
  AllergyType,
  MedTemplateType,
  MedType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../utils/dates/formatDates";
import { toDurationText } from "../../../../../utils/dates/toDurationText";
import { toPrescriptionInstructions } from "../../../../../utils/medications/toPrescriptionInstructions";
import { medicationSchema } from "../../../../../validation/record/medicationValidation";
import Button from "../../../../UI/Buttons/Button";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import SubmitButton from "../../../../UI/Buttons/SubmitButton";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import GenericCombo from "../../../../UI/Lists/GenericCombo";
import GenericList from "../../../../UI/Lists/GenericList";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import DurationPickerLong from "../../../../UI/Pickers/DurationPickerLong";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import AllergiesList from "./AllergiesList";
import MedsTemplatesList from "./Templates/MedsTemplatesList";

type MedicationFormWithoutRXProps = {
  patientId: number;
  setMedFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  allergies: AllergyType[];
};

const MedicationFormWithoutRX = ({
  patientId,
  setMedFormVisible,
  allergies,
}: MedicationFormWithoutRXProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const [formDatas, setFormDatas] = useState<Partial<MedType>>({
    StartDate: nowTZTimestamp(),
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
    refill_duration: {
      Y: 0,
      M: 0,
      W: 0,
      D: 0,
    },
    Quantity: "",
    RefillQuantity: "",
    NumberOfRefills: "",
    LongTermMedication: { ynIndicatorsimple: "N" },
    Notes: "",
    PrescriptionInstructions: "",
    SubstitutionNotAllowed: "N",
    PrescribedBy: {
      Name: {
        FirstName: "",
        LastName: "",
      },
      OHIPPhysicianId: "",
    },
  });
  const [errMsg, setErrMsg] = useState("");
  const [search, setSearch] = useState("");
  const [progressTemplates, setProgressTemplates] = useState(false);
  //Queries
  const {
    data: templates,
    isPending: isPendingTemplates,
    error: errorTemplates,
    isFetchingNextPage: isFetchingNextPageTemplates,
    fetchNextPage: fetchNextPageTemplates,
    isFetching: isFetchingTemplates,
  } = useMedsTemplates(search);
  const medTemplatePost = useMedsTemplatePost();
  const medPost = useTopicPost("MEDICATIONS & TREATMENTS", patientId);

  //HANDLERS
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //Formatting
    const medicationToPost: Partial<MedType> = {
      ...formDatas,
      patient_id: patientId,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
      site_id: user.site_id,
      DrugName: formDatas.DrugName?.toUpperCase(),
    };
    //Validation
    try {
      await medicationSchema.validate(medicationToPost);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    //Submission
    medPost.mutate(medicationToPost, {
      onSuccess: () => {
        setTemplatesVisible(false);
        setMedFormVisible(false);
      },
    });
  };

  const handleSelectTemplate = (template: MedTemplateType) => {
    const newFormDatas: Partial<MedTemplateType> = { ...template };
    delete newFormDatas.id;
    delete newFormDatas.author_id;
    delete newFormDatas.date_created;
    setFormDatas(newFormDatas);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };

  const handleSubmitAndSaveTemplate = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const medicationToPost = {
      ...formDatas,
      patient_id: patientId,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
      site_id: user.site_id,
      DrugName: formDatas.DrugName?.toUpperCase(),
    };
    //Validation
    try {
      await medicationSchema.validate(medicationToPost);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    //Submission
    medPost.mutate(medicationToPost, {
      onSuccess: () => {
        setTemplatesVisible(false);
        setMedFormVisible(false);
      },
    });

    //templates
    const templateToPost = {
      ...formDatas,
      author_id: user.id,
      date_created: nowTZTimestamp(),
      DrugName: formDatas.DrugName?.toUpperCase(),
    };
    //Submission
    setProgressTemplates(true);
    medTemplatePost.mutate(templateToPost, {
      onSuccess: () => {
        setProgressTemplates(false);
      },
      onError: () => {
        setProgressTemplates(false);
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
        setFormDatas({
          ...formDatas,
          Strength: {
            ...(formDatas.Strength as { Amount: ""; UnitOfMeasure: "" }),
            Amount: value,
          },
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName ?? "",
            value,
            formDatas.Strength?.UnitOfMeasure ?? "",
            formDatas.SubstitutionNotAllowed ?? "",
            formDatas.Quantity ?? "",
            formDatas.Form ?? "",
            formDatas.Route ?? "",
            formDatas.Dosage ?? "",
            formDatas.DosageUnitOfMeasure ?? "",
            formDatas.Frequency ?? "",
            formDatas.Duration ?? "",
            formDatas.NumberOfRefills ?? "",
            formDatas.RefillQuantity ?? "",
            formDatas.RefillDuration ?? ""
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
      case "DrugIdentificationNumber":
        setFormDatas({
          ...formDatas,
          [name]: value,
        });
        break;
      case "DrugName":
        setFormDatas({
          ...formDatas,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            value,
            formDatas.Strength?.Amount ?? "",
            formDatas.Strength?.UnitOfMeasure ?? "",
            formDatas.SubstitutionNotAllowed ?? "",
            formDatas.Quantity ?? "",
            formDatas.Form ?? "",
            formDatas.Route ?? "",
            formDatas.Dosage ?? "",
            formDatas.DosageUnitOfMeasure ?? "",
            formDatas.Frequency ?? "",
            formDatas.Duration ?? "",
            formDatas.NumberOfRefills ?? "",
            formDatas.RefillQuantity ?? "",
            formDatas.RefillDuration ?? ""
          ),
        });
        break;
      case "Dosage":
        setFormDatas({
          ...formDatas,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName ?? "",
            formDatas.Strength?.Amount ?? "",
            formDatas.Strength?.UnitOfMeasure ?? "",
            formDatas.SubstitutionNotAllowed ?? "",
            formDatas.Quantity ?? "",
            formDatas.Form ?? "",
            formDatas.Route ?? "",
            value,
            formDatas.DosageUnitOfMeasure ?? "",
            formDatas.Frequency ?? "",
            formDatas.Duration ?? "",
            formDatas.NumberOfRefills ?? "",
            formDatas.RefillQuantity ?? "",
            formDatas.RefillDuration ?? ""
          ),
        });
        break;
      case "SubstitutionNotAllowed":
        setFormDatas({
          ...formDatas,
          [name]: value === "Y" ? "N" : "Y",
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName ?? "",
            formDatas.Strength?.Amount ?? "",
            formDatas.Strength?.UnitOfMeasure ?? "",
            value === "Y" ? "N" : "Y",
            formDatas.Quantity ?? "",
            formDatas.Form ?? "",
            formDatas.Route ?? "",
            formDatas.Dosage ?? "",
            formDatas.DosageUnitOfMeasure ?? "",
            formDatas.Frequency ?? "",
            formDatas.Duration ?? "",
            formDatas.NumberOfRefills ?? "",
            formDatas.RefillQuantity ?? "",
            formDatas.RefillDuration ?? ""
          ),
        });
        break;
      case "Quantity":
        setFormDatas({
          ...formDatas,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName ?? "",
            formDatas.Strength?.Amount ?? "",
            formDatas.Strength?.UnitOfMeasure ?? "",
            formDatas.SubstitutionNotAllowed ?? "",
            value,
            formDatas.Form ?? "",
            formDatas.Route ?? "",
            formDatas.Dosage ?? "",
            formDatas.DosageUnitOfMeasure ?? "",
            formDatas.Frequency ?? "",
            formDatas.Duration ?? "",
            formDatas.NumberOfRefills ?? "",
            formDatas.RefillQuantity ?? "",
            formDatas.RefillDuration ?? ""
          ),
        });
        break;
      case "RefillQuantity":
        setFormDatas({
          ...formDatas,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName ?? "",
            formDatas.Strength?.Amount ?? "",
            formDatas.Strength?.UnitOfMeasure ?? "",
            formDatas.SubstitutionNotAllowed ?? "",
            formDatas.Quantity ?? "",
            formDatas.Form ?? "",
            formDatas.Route ?? "",
            formDatas.Dosage ?? "",
            formDatas.DosageUnitOfMeasure ?? "",
            formDatas.Frequency ?? "",
            formDatas.Duration ?? "",
            formDatas.NumberOfRefills ?? "",
            value,
            formDatas.RefillDuration ?? ""
          ),
        });
        break;
      case "NumberOfRefills":
        setFormDatas({
          ...formDatas,
          [name]: value,
          PrescriptionInstructions: toPrescriptionInstructions(
            formDatas.DrugName ?? "",
            formDatas.Strength?.Amount ?? "",
            formDatas.Strength?.UnitOfMeasure ?? "",
            formDatas.SubstitutionNotAllowed ?? "",
            formDatas.Quantity ?? "",
            formDatas.Form ?? "",
            formDatas.Route ?? "",
            formDatas.Dosage ?? "",
            formDatas.DosageUnitOfMeasure ?? "",
            formDatas.Frequency ?? "",
            formDatas.Duration ?? "",
            value,
            formDatas.RefillQuantity ?? "",
            formDatas.RefillDuration ?? ""
          ),
        });
        break;
      default:
        setFormDatas({ ...formDatas, [name]: value });
        break;
    }
  };
  const handleDurationPickerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "Y" | "M" | "W" | "D"
  ) => {
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      duration: {
        ...(formDatas.duration as {
          Y: number;
          M: number;
          W: number;
          D: number;
        }),
        [type]: parseInt(value),
      },
      Duration: toDurationText(
        formDatas.duration?.Y ?? 0,
        formDatas.duration?.M ?? 0,
        formDatas.duration?.W ?? 0,
        formDatas.duration?.D ?? 0,
        type,
        parseInt(value)
      ),
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName ?? "",
        formDatas.Strength?.Amount ?? "",
        formDatas.Strength?.UnitOfMeasure ?? "",
        formDatas.SubstitutionNotAllowed ?? "",
        formDatas.Quantity ?? "",
        formDatas.Form ?? "",
        formDatas.Route ?? "",
        formDatas.Dosage ?? "",
        formDatas.DosageUnitOfMeasure ?? "",
        formDatas.Frequency ?? "",
        toDurationText(
          formDatas.duration?.Y ?? 0,
          formDatas.duration?.M ?? 0,
          formDatas.duration?.W ?? 0,
          formDatas.duration?.D ?? 0,
          type,
          parseInt(value)
        ),
        formDatas.NumberOfRefills ?? "",
        formDatas.RefillQuantity ?? "",
        formDatas.RefillDuration ?? ""
      ),
    });
  };

  const handleRefillDurationPickerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "Y" | "M" | "W" | "D"
  ) => {
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      refill_duration: {
        ...(formDatas.refill_duration as {
          Y: number;
          M: number;
          W: number;
          D: number;
        }),
        [type]: parseInt(value),
      },
      RefillDuration: toDurationText(
        formDatas.refill_duration?.Y ?? 0,
        formDatas.refill_duration?.M ?? 0,
        formDatas.refill_duration?.W ?? 0,
        formDatas.refill_duration?.D ?? 0,
        type,
        parseInt(value)
      ),
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName ?? "",
        formDatas.Strength?.Amount ?? "",
        formDatas.Strength?.UnitOfMeasure ?? "",
        formDatas.SubstitutionNotAllowed ?? "",
        formDatas.Quantity ?? "",
        formDatas.Form ?? "",
        formDatas.Route ?? "",
        formDatas.Dosage ?? "",
        formDatas.DosageUnitOfMeasure ?? "",
        formDatas.Frequency ?? "",
        formDatas.Duration ?? "",
        formDatas.NumberOfRefills ?? "",
        formDatas.RefillQuantity ?? "",
        toDurationText(
          formDatas.refill_duration?.Y ?? 0,
          formDatas.refill_duration?.M ?? 0,
          formDatas.refill_duration?.W ?? 0,
          formDatas.refill_duration?.D ?? 0,
          type,
          parseInt(value)
        )
      ),
    });
  };
  const handleRouteChange = (value: string) => {
    setFormDatas({
      ...formDatas,
      Route: value,
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName ?? "",
        formDatas.Strength?.Amount ?? "",
        formDatas.Strength?.UnitOfMeasure ?? "",
        formDatas.SubstitutionNotAllowed ?? "",
        formDatas.Quantity ?? "",
        formDatas.Form ?? "",
        value,
        formDatas.Dosage ?? "",
        formDatas.DosageUnitOfMeasure ?? "",
        formDatas.Frequency ?? "",
        formDatas.Duration ?? "",
        formDatas.NumberOfRefills ?? "",
        formDatas.RefillQuantity ?? "",
        formDatas.RefillDuration ?? ""
      ),
    });
  };
  const handleFrequencyChange = (value: string) => {
    setFormDatas({
      ...formDatas,
      Frequency: value,
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName ?? "",
        formDatas.Strength?.Amount ?? "",
        formDatas.Strength?.UnitOfMeasure ?? "",
        formDatas.SubstitutionNotAllowed ?? "",
        formDatas.Quantity ?? "",
        formDatas.Form ?? "",
        formDatas.Route ?? "",
        formDatas.Dosage ?? "",
        formDatas.DosageUnitOfMeasure ?? "",
        value,
        formDatas.Duration ?? "",
        formDatas.NumberOfRefills ?? "",
        formDatas.RefillQuantity ?? "",
        formDatas.RefillDuration ?? ""
      ),
    });
  };
  const handleDosageUnitChange = (value: string) => {
    setFormDatas({
      ...formDatas,
      DosageUnitOfMeasure: value,
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName ?? "",
        formDatas.Strength?.Amount ?? "",
        formDatas.Strength?.UnitOfMeasure ?? "",
        formDatas.SubstitutionNotAllowed ?? "",
        formDatas.Quantity ?? "",
        formDatas.Form ?? "",
        formDatas.Route ?? "",
        formDatas.Dosage ?? "",
        value,
        formDatas.Frequency ?? "",
        formDatas.Duration ?? "",
        formDatas.NumberOfRefills ?? "",
        formDatas.RefillQuantity ?? "",
        formDatas.RefillDuration ?? ""
      ),
    });
  };
  const handleStrengthUnitChange = (value: string) => {
    setFormDatas({
      ...formDatas,
      Strength: {
        ...(formDatas.Strength as { Amount: ""; UnitOfMeasure: "" }),
        UnitOfMeasure: value,
      },
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName ?? "",
        formDatas.Strength?.Amount ?? "",
        value,
        formDatas.SubstitutionNotAllowed ?? "",
        formDatas.Quantity ?? "",
        formDatas.Form ?? "",
        formDatas.Route ?? "",
        formDatas.Dosage ?? "",
        formDatas.DosageUnitOfMeasure ?? "",
        formDatas.Frequency ?? "",
        formDatas.Duration ?? "",
        formDatas.NumberOfRefills ?? "",
        formDatas.RefillQuantity ?? "",
        formDatas.RefillDuration ?? ""
      ),
    });
  };
  const handleFormChange = (value: string) => {
    setFormDatas({
      ...formDatas,
      Form: value,
      PrescriptionInstructions: toPrescriptionInstructions(
        formDatas.DrugName ?? "",
        formDatas.Strength?.Amount ?? "",
        formDatas.Strength?.UnitOfMeasure ?? "",
        formDatas.SubstitutionNotAllowed ?? "",
        formDatas.Quantity ?? "",
        value,
        formDatas.Route ?? "",
        formDatas.Dosage ?? "",
        formDatas.DosageUnitOfMeasure ?? "",
        formDatas.Frequency ?? "",
        formDatas.Duration ?? "",
        formDatas.NumberOfRefills ?? "",
        formDatas.RefillQuantity ?? "",
        formDatas.RefillDuration ?? ""
      ),
    });
  };
  const handleUseTemplate = () => {
    setTemplatesVisible((v) => !v);
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDatas({
      ...formDatas,
      StartDate: dateISOToTimestampTZ(e.target.value),
    });
  };

  return (
    <form
      className="medications-form"
      onSubmit={handleSubmit}
      style={{ marginTop: "40px", height: "730px" }}
    >
      <div className="medications-form__btn-container">
        <SubmitButton label="Save" disabled={progressTemplates} />
        <SaveButton
          onClick={handleSubmitAndSaveTemplate}
          disabled={progressTemplates}
          label="Save & Add to templates"
        />
        <Button
          onClick={handleUseTemplate}
          disabled={progressTemplates}
          label="Use template"
        />
      </div>
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <div className="medications-form__allergies">
        <AllergiesList allergies={allergies} />
      </div>
      <div className="medications-form__container medications-form__container--norx">
        <div className="med-templates__form-row">
          <InputDate
            label="Start Date"
            value={timestampToDateISOTZ(formDatas.StartDate)}
            onChange={handleStartChange}
          />
        </div>
        <div className="med-templates__form-row">
          <Input
            label="Drug identification number"
            name="DrugIdentificationNumber"
            value={formDatas.DrugIdentificationNumber ?? ""}
            onChange={handleChange}
            id="med-template-drug-number"
          />
        </div>
        <div className="med-templates__form-row">
          <Input
            label="Drug name*"
            name="DrugName"
            value={formDatas.DrugName ?? ""}
            onChange={handleChange}
            id="med-template-drug-name"
          />
        </div>
        <div className="med-templates__form-row">
          <Input
            label="Strength*"
            name="Strength"
            value={formDatas.Strength?.Amount ?? ""}
            onChange={handleChange}
            id="med-template-strength"
          />
        </div>
        <div className="med-templates__form-row">
          <GenericCombo
            list={strengthUnitCT}
            value={formDatas.Strength?.UnitOfMeasure ?? ""}
            handleChange={handleStrengthUnitChange}
            label="Strength unit of measure*"
          />
        </div>
        <div className="med-templates__form-row">
          <GenericCombo
            list={formCT}
            value={formDatas.Form ?? ""}
            handleChange={handleFormChange}
            label="Form*"
          />
        </div>
        <div className="med-templates__form-row">
          <Input
            label="Dosage*"
            name="Dosage"
            value={formDatas.Dosage ?? ""}
            onChange={handleChange}
            id="med-template-dosage"
          />
        </div>
        <div className="med-templates__form-row">
          <GenericCombo
            list={dosageUnitCT}
            value={formDatas.DosageUnitOfMeasure ?? ""}
            handleChange={handleDosageUnitChange}
            label="Dosage unit of measure*"
          />
        </div>
        <div className="med-templates__form-row">
          <GenericCombo
            list={routeCT}
            value={formDatas.Route ?? ""}
            handleChange={handleRouteChange}
            label="Route*"
          />
        </div>
        <div className="med-templates__form-row">
          <GenericCombo
            list={frequencyCT}
            value={formDatas.Frequency ?? ""}
            handleChange={handleFrequencyChange}
            label="Frequency*"
          />
        </div>
        <div className="med-templates__form-row">
          <DurationPickerLong
            label="Duration"
            durationYears={formDatas.duration?.Y ?? 0}
            durationMonths={formDatas.duration?.M ?? 0}
            durationWeeks={formDatas.duration?.W ?? 0}
            durationDays={formDatas.duration?.D ?? 0}
            handleDurationPickerChange={handleDurationPickerChange}
          />
        </div>
        <div className="med-templates__form-row">
          <Input
            label="Quantity"
            name="Quantity"
            value={formDatas.Quantity ?? ""}
            onChange={handleChange}
            id="med-template-quantity"
          />
        </div>
        <div className="med-templates__form-row">
          <DurationPickerLong
            label="Refill duration"
            durationYears={formDatas.refill_duration?.Y ?? 0}
            durationMonths={formDatas.refill_duration?.M ?? 0}
            durationWeeks={formDatas.refill_duration?.W ?? 0}
            durationDays={formDatas.refill_duration?.D ?? 0}
            handleDurationPickerChange={handleRefillDurationPickerChange}
          />
        </div>
        <div className="med-templates__form-row">
          <Input
            label="Refill quantity"
            name="RefillQuantity"
            value={formDatas.RefillQuantity ?? ""}
            onChange={handleChange}
            id="med-template-refill-quantity"
          />
        </div>
        <div className="med-templates__form-row">
          <Input
            label="Number of refills"
            name="NumberOfRefills"
            value={formDatas.NumberOfRefills ?? ""}
            onChange={handleChange}
            id="med-template-nbr-refills"
          />
        </div>
        <div className="med-templates__form-row">
          <GenericList
            name="LongTermMedication"
            list={ynIndicatorsimpleCT}
            value={formDatas.LongTermMedication?.ynIndicatorsimple ?? "N"}
            handleChange={handleChange}
            placeHolder="Choose..."
            label="Long-term medication*"
          />
        </div>
        <div className="med-templates__form-row">
          <GenericList
            name="SubstitutionNotAllowed"
            list={ynIndicatorsimpleCT}
            value={formDatas.SubstitutionNotAllowed === "Y" ? "N" : "Y"}
            handleChange={handleChange}
            placeHolder="Choose..."
            label="Substitution allowed*"
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
            <label htmlFor="med-template-instructions">Instructions*</label>
          </Tooltip>
          <textarea
            className="med-templates__form-instructions"
            value={formDatas.PrescriptionInstructions}
            onChange={handleChange}
            name="PrescriptionInstructions"
            id="med-template-instructions"
          />
        </div>
      </div>
      {templatesVisible && (
        <FakeWindow
          title="MEDICATIONS TEMPLATES"
          width={800}
          height={600}
          x={0}
          y={0}
          color="#931621"
          setPopUpVisible={setTemplatesVisible}
        >
          <MedsTemplatesList
            medsTemplates={templates}
            progress={false}
            isPendingTemplates={isPendingTemplates}
            errorTemplates={errorTemplates}
            isFetchingNextPageTemplates={isFetchingNextPageTemplates}
            fetchNextPageTemplates={fetchNextPageTemplates}
            isFetchingTemplates={isFetchingTemplates}
            search={search}
            handleSearch={handleSearch}
            allergies={allergies}
            handleSelectTemplate={handleSelectTemplate}
          />
        </FakeWindow>
      )}
    </form>
  );
};

export default MedicationFormWithoutRX;
