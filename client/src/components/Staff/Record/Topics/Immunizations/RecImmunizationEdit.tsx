import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
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
import { firstLetterUpper } from "../../../../../utils/strings/firstLetterUpper";
import { immunizationSchema } from "../../../../../validation/record/immunizationValidation";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import FormRecImmunization from "./FormRecImmunization";

type RecImmunizationEditProps = {
  immunizationInfos: ImmunizationType;
  type: RecImmunizationTypeListType;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  topicPut: UseMutationResult<ImmunizationType, Error, ImmunizationType, void>;
  topicDelete: UseMutationResult<void, Error, number, void>;
};

const RecImmunizationEdit = ({
  immunizationInfos,
  type,
  setEditVisible,
  errMsgPost,
  setErrMsgPost,
  topicPut,
  topicDelete,
}: RecImmunizationEditProps) => {
  //HOOKS
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] =
    useState<ImmunizationType>(immunizationInfos);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setFormDatas(immunizationInfos);
  }, [immunizationInfos]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setErrMsgPost("");
    e.preventDefault();
    //Formatting
    const topicToPut: ImmunizationType = {
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
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    //Submission
    setProgress(true);
    topicPut.mutate(topicToPut, {
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
    } else if (name === "Date") {
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
      handleDelete={handleDelete}
      progress={progress}
    />
  );
};

export default RecImmunizationEdit;
