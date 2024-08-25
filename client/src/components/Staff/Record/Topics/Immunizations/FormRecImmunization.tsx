import React from "react";
import {
  routeCT,
  siteCT,
  ynIndicatorsimpleCT,
} from "../../../../../omdDatas/codesTables";
import {
  ImmunizationType,
  RecImmunizationTypeListType,
} from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import DeleteButton from "../../../../UI/Buttons/DeleteButton";
import SubmitButton from "../../../../UI/Buttons/SubmitButton";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import GenericCombo from "../../../../UI/Lists/GenericCombo";
import GenericList from "../../../../UI/Lists/GenericList";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";

type FormRecImmunizationProps = {
  formDatas: Partial<ImmunizationType>;
  errMsgPost: string;
  type: RecImmunizationTypeListType;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleRouteChange: (value: string) => void;
  handleSiteChange: (value: string) => void;
  handleCancel: () => void;
  handleDelete?: () => void;
  progress: boolean;
};

const FormRecImmunization = ({
  formDatas,
  errMsgPost,
  type,
  handleSubmit,
  handleChange,
  handleRouteChange,
  handleSiteChange,
  handleCancel,
  handleDelete,
  progress,
}: FormRecImmunizationProps) => {
  return (
    <form onSubmit={handleSubmit} className="recimmunizations-form">
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="recimmunizations-form__row">
        <label>Immunization type: </label>
        <p>{type}</p>
      </div>
      <div className="recimmunizations-form__row">
        <Input
          value={formDatas.ImmunizationName ?? ""}
          onChange={handleChange}
          name="ImmunizationName"
          id="recimmunization-brand-name"
          label="Immunization brand name:"
        />
      </div>
      <div className="recimmunizations-form__row">
        <Input
          value={formDatas.Manufacturer ?? ""}
          onChange={handleChange}
          name="Manufacturer"
          id="recimmunization-manufacturer"
          label="Manufacturer:"
        />
      </div>
      <div className="recimmunizations-form__row">
        <Input
          value={formDatas.LotNumber ?? ""}
          onChange={handleChange}
          name="LotNumber"
          id="recimmunization-lot"
          label="Lot#:"
        />
      </div>
      <div className="recimmunizations-form__row">
        <GenericCombo
          list={routeCT}
          value={formDatas.Route ?? ""}
          handleChange={handleRouteChange}
          label="Route:"
        />
      </div>
      <div className="recimmunizations-form__row">
        <GenericCombo
          list={siteCT}
          value={formDatas.Site ?? ""}
          handleChange={handleSiteChange}
          label="Site:"
        />
      </div>
      <div className="recimmunizations-form__row">
        <Input
          value={formDatas.Dose ?? ""}
          onChange={handleChange}
          name="Dose"
          id="recimmunization-dose"
          label="Dose:"
        />
      </div>
      <div className="recimmunizations-form__row">
        <InputDate
          value={timestampToDateISOTZ(formDatas.Date)}
          onChange={handleChange}
          name="Date"
          id="recimmunization-date"
          label="Date:"
        />
      </div>
      <div className="recimmunizations-form__row">
        <GenericList
          list={ynIndicatorsimpleCT}
          name="RefusedFlag"
          handleChange={handleChange}
          value={formDatas.RefusedFlag?.ynIndicatorsimple ?? ""}
          label="Refused: "
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
        {handleDelete && (
          <DeleteButton onClick={handleDelete} disabled={progress} />
        )}
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </form>
  );
};

export default FormRecImmunization;
