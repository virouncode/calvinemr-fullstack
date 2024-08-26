import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
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
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import InputDate from "../../../../UI/Inputs/InputDate";
import GenericCombo from "../../../../UI/Lists/GenericCombo";
import GenericList from "../../../../UI/Lists/GenericList";
import FormSignCell from "../../../../UI/Tables/FormSignCell";
import GenericComboImmunization from "./ImmunizationCombo";

type ImmunizationFormProps = {
  patientId: number;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  editCounter: React.MutableRefObject<number>;
  topicPost: UseMutationResult<
    ImmunizationType,
    Error,
    Partial<ImmunizationType>,
    void
  >;
};

const ImmunizationForm = ({
  patientId,
  setAddVisible,
  errMsgPost,
  setErrMsgPost,
  editCounter,
  topicPost,
}: ImmunizationFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState<Partial<ImmunizationType>>({
    patient_id: patientId,
    ImmunizationType: "",
    ImmunizationName: "",
    Manufacturer: "",
    LotNumber: "",
    Route: "",
    Site: "",
    Dose: "",
    Instructions: "",
    Notes: "",
    recommended: false,
    Date: nowTZTimestamp(),
    RefusedFlag: { ynIndicatorsimple: "N" },
  });
  const [progress, setProgress] = useState(false);

  const handleRouteChange = (value: string) => {
    setFormDatas({ ...formDatas, Route: value });
  };
  const handleSiteChange = (value: string) => {
    setFormDatas({ ...formDatas, Site: value });
  };
  const handleImmunizationChange = (value: string) => {
    setFormDatas({ ...formDatas, ImmunizationType: value });
  };

  const handleSubmit = async () => {
    setErrMsgPost("");
    //Formatting
    const topicToPost: Partial<ImmunizationType> = {
      ...formDatas,
      ImmunizationName: firstLetterUpper(formDatas.ImmunizationName ?? ""),
      Manufacturer: firstLetterUpper(formDatas.Manufacturer ?? ""),
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    //Validation
    try {
      await immunizationSchema.validate(topicToPost);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }

    //Submission
    setProgress(true);
    topicPost.mutate(topicToPost, {
      onSuccess: () => {
        editCounter.current -= 1;
        setAddVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    let value: string | number | null = e.target.value;
    if (name === "RefusedFlag") {
      setFormDatas({ ...formDatas, RefusedFlag: { ynIndicatorsimple: value } });
      return;
    }
    if (name === "Date") {
      value = dateISOToTimestampTZ(value);
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleCancel = () => {
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  return (
    <tr className="immunizations__form">
      <td
        style={{ textAlign: "center", border: errMsgPost && "solid 1.5px red" }}
      >
        <div className="immunizations__form-btn-container">
          <SaveButton onClick={handleSubmit} disabled={progress} />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td className="immunizations__form-type-list">
        <GenericComboImmunization
          list={immunizationTypeCT}
          value={formDatas.ImmunizationType ?? ""}
          handleChange={handleImmunizationChange}
        />
      </td>
      <td>
        <Input
          name="ImmunizationName"
          value={formDatas.ImmunizationName ?? ""}
          onChange={handleChange}
        />
      </td>
      <td>
        <Input
          name="Manufacturer"
          value={formDatas.Manufacturer ?? ""}
          onChange={handleChange}
        />
      </td>
      <td>
        <Input
          name="LotNumber"
          value={formDatas.LotNumber ?? ""}
          onChange={handleChange}
        />
      </td>
      <td>
        <GenericCombo
          list={routeCT}
          value={formDatas.Route ?? ""}
          handleChange={handleRouteChange}
        />
      </td>
      <td>
        <GenericCombo
          list={siteCT}
          value={formDatas.Site ?? ""}
          handleChange={handleSiteChange}
        />
      </td>
      <td>
        <Input
          name="Dose"
          value={formDatas.Dose ?? ""}
          onChange={handleChange}
        />
      </td>
      <td>
        <InputDate
          name="Date"
          value={timestampToDateISOTZ(formDatas.Date)}
          onChange={handleChange}
        />
      </td>
      <td>
        <GenericList
          list={ynIndicatorsimpleCT}
          name="RefusedFlag"
          value={formDatas.RefusedFlag?.ynIndicatorsimple ?? "N"}
          handleChange={handleChange}
        />
      </td>
      <td>
        <Input
          name="Instructions"
          value={formDatas.Instructions ?? ""}
          onChange={handleChange}
        />
      </td>
      <td>
        <Input
          name="Notes"
          value={formDatas.Notes ?? ""}
          onChange={handleChange}
        />
      </td>
      <FormSignCell />
    </tr>
  );
};

export default ImmunizationForm;
