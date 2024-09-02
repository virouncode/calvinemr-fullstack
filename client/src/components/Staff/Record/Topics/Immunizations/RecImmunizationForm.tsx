import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  ImmunizationFormType,
  ImmunizationType,
  RecImmunizationTypeListType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
} from "../../../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { immunizationSchema } from "../../../../../validation/record/immunizationValidation";
import FormRecImmunization from "./FormRecImmunization";

type RecImmunizationFormProps = {
  setFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  type: RecImmunizationTypeListType;
  patientId: number;
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  topicPost: UseMutationResult<
    ImmunizationType,
    Error,
    Partial<ImmunizationType>,
    void
  >;
};

const RecImmunizationForm = ({
  setFormVisible,
  type,
  patientId,
  errMsgPost,
  setErrMsgPost,
  topicPost,
}: RecImmunizationFormProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState<ImmunizationFormType>({
    patient_id: patientId,
    date_created: nowTZTimestamp(),
    created_by_id: user.id,
    ImmunizationName: "",
    ImmunizationType: "",
    Manufacturer: "",
    LotNumber: "",
    Route: "",
    Site: "",
    Dose: "",
    Date: null,
    RefusedFlag: { ynIndicatorsimple: "N" },
    Instructions: "",
    Notes: "",
    age: "",
    doseNumber: 0,
    recommended: false,
  });
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleCancel = () => {
    setFormVisible(false);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setErrMsgPost("");
    e.preventDefault();
    //Formatting
    const topicToPost: ImmunizationFormType = {
      ...formDatas,
      ImmunizationName: firstLetterUpper(formDatas.ImmunizationName ?? ""),
      Manufacturer: firstLetterUpper(formDatas.Manufacturer ?? ""),
      patient_id: patientId,
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
        setFormVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    let value: string | number | null = e.target.value;
    const name = e.target.name;

    if (name === "RefusedFlag") {
      setFormDatas({
        ...formDatas,
        RefusedFlag: { ynIndicatorsimple: value as "Y" | "N" },
      });
      return;
    }
    if (name === "Date") {
      value = dateISOToTimestampTZ(value);
    }
    setFormDatas({
      ...formDatas,
      [name]: value,
    });
  };
  const handleRouteChange = (value: string) => {
    setFormDatas({
      ...formDatas,
      Route: value,
    });
  };
  const handleSiteChange = (value: string) => {
    setFormDatas({
      ...formDatas,
      Site: value,
    });
  };

  return (
    <FormRecImmunization
      formDatas={formDatas}
      errMsgPost={errMsgPost}
      type={type}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      handleRouteChange={handleRouteChange}
      handleSiteChange={handleSiteChange}
      handleCancel={handleCancel}
      progress={progress}
    />
  );
};

export default RecImmunizationForm;
