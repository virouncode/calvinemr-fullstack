import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { CycleType, DemographicsType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { initialCycle } from "../../../../../utils/initialDatas/initialDatas";
import { cycleSchema } from "../../../../../validation/cycles/cycleValidation";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressSmall from "../../../../UI/Progress/CircularProgressSmall";
import CycleCycleInfos from "./CycleCycleInfos";
import CycleEvents from "./CycleEvents";
import CycleNotes from "./CycleNotes";
import CyclePatientInfos from "./CyclePatientInfos";
import CycleSpermInfos from "./CycleSpermInfos";
import CycleTestsInfos from "./CycleTestsInfos";

type CycleFormProps = {
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
  demographicsInfos: DemographicsType;
  topicPost: UseMutationResult<CycleType, Error, Partial<CycleType>, void>;
};

const CycleForm = ({
  setAddVisible,
  patientId,
  demographicsInfos,
  topicPost,
}: CycleFormProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [progress, setProgress] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [formDatas, setFormDatas] = useState<Partial<CycleType>>(
    initialCycle(patientId)
  );

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setErrMsg("");
    try {
      await cycleSchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    const cycleToPost: Partial<CycleType> = {
      ...formDatas,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
      cycle_nbr: `${demographicsInfos.ChartNumber}-${formDatas.cycle_nbr}`,
    };

    setProgress(true);
    topicPost.mutate(cycleToPost, {
      onSuccess: () => {
        setAddVisible(false);
        setProgress(false);
      },
      onError: () => setProgress(false),
    });
  };

  const handleClose = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (
      await confirmAlert({
        content:
          "Do you really want to close the window ? Your changes will be lost",
      })
    ) {
      setAddVisible(false);
    }
  };
  return (
    <form className="cycles-form">
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <CyclePatientInfos
        demographicsInfos={demographicsInfos}
        errMsg={errMsg}
      />
      <CycleSpermInfos
        formDatas={formDatas}
        setFormDatas={setFormDatas}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
      />
      <CycleCycleInfos
        formDatas={formDatas}
        setFormDatas={setFormDatas}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
      />
      <CycleTestsInfos
        formDatas={formDatas}
        setFormDatas={setFormDatas}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
      />
      <CycleEvents
        formDatas={formDatas}
        setFormDatas={setFormDatas}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
      />
      <CycleNotes
        formDatas={formDatas}
        setFormDatas={setFormDatas}
        errMsg={errMsg}
        setErrMsg={setErrMsg}
      />
      <div className="cycles-form__btn-container">
        <SaveButton onClick={handleSubmit} disabled={progress} />
        <CloseButton onClick={handleClose} disabled={progress} />
        {progress && <CircularProgressSmall />}
      </div>
    </form>
  );
};

export default CycleForm;
