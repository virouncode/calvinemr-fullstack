import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  ImmunizationType,
  RecImmunizationTypeListType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
} from "../../../../../utils/dates/formatDates";
import {
  RecImmunizationAgeType,
  RecImmunizationRouteType,
} from "../../../../../utils/immunizations/recommendedImmunizations";
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { immunizationSchema } from "../../../../../validation/record/immunizationValidation";
import FormRecImmunization from "./FormRecImmunization";

type RecImmunizationFormMultipleProps = {
  setFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  type: RecImmunizationTypeListType;
  age: RecImmunizationAgeType;
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  route: RecImmunizationRouteType;
  patientId: number;
  topicPost: UseMutationResult<
    ImmunizationType,
    Error,
    Partial<ImmunizationType>,
    void
  >;
};

const RecImmunizationFormMultiple = ({
  setFormVisible,
  type,
  age,
  errMsgPost,
  setErrMsgPost,
  route,
  patientId,
  topicPost,
}: RecImmunizationFormMultipleProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState<Partial<ImmunizationType>>({
    ImmunizationName: "",
    ImmunizationType: type,
    Manufacturer: "",
    LotNumber: "",
    Route: route,
    Site: "",
    Dose: "",
    Date: null,
    RefusedFlag: { ynIndicatorsimple: "N" },
    Instructions: "",
    Notes: "",
    age: age,
    patient_id: patientId,
    recommended: true,
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
    const topicToPost: Partial<ImmunizationType> = {
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
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    let value: string | number | null = e.target.value;
    const name = e.target.name;
    if (name === "RefusedFlag") {
      setFormDatas({
        ...formDatas,
        RefusedFlag: { ynIndicatorsimple: value },
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

export default RecImmunizationFormMultiple;
