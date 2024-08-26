import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { CycleType, DemographicsType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { cycleSchema } from "../../../../../validation/cycles/cycleValidation";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import PrintButton from "../../../../UI/Buttons/PrintButton";
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

type CycleDetailsProps = {
  cycleToShow: CycleType;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  demographicsInfos: DemographicsType;
  topicPut: UseMutationResult<CycleType, Error, CycleType, void>;
};

const CycleDetails = ({
  cycleToShow,
  setShow,
  demographicsInfos,
  topicPut,
}: CycleDetailsProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [progress, setProgress] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [itemInfos, setItemInfos] = useState<Partial<CycleType>>({});
  useEffect(() => {
    setItemInfos({
      ...cycleToShow,
      cycle_nbr: cycleToShow.cycle_nbr.split("-")[3],
    });
  }, [cycleToShow]);

  const handleSave = async () => {
    try {
      await cycleSchema.validate(itemInfos);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    const cycleToPut: CycleType = {
      ...(itemInfos as CycleType),
      updates: [
        ...(itemInfos?.updates ?? []),
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
      cycle_nbr: `${demographicsInfos.ChartNumber}-${itemInfos?.cycle_nbr}`,
    };

    setProgress(true);
    topicPut.mutate(cycleToPut, {
      onSuccess: () => {
        setShow(false);
        setProgress(false);
      },
      onError: () => setProgress(false),
    });
  };
  const handleClose = async () => {
    if (
      await confirmAlert({
        content:
          "Do you really want to close the window ? Your changes will be lost",
      })
    ) {
      setShow(false);
    }
  };
  const handlePrint = () => {};
  return (
    itemInfos && (
      <form className="cycles-form">
        {errMsg && <ErrorParagraph errorMsg={errMsg} />}
        <CyclePatientInfos
          demographicsInfos={demographicsInfos}
          errMsg={errMsg}
        />
        <CycleSpermInfos
          formDatas={itemInfos}
          setFormDatas={setItemInfos}
          errMsg={errMsg}
          setErrMsg={setErrMsg}
        />
        <CycleCycleInfos
          formDatas={itemInfos}
          setFormDatas={setItemInfos}
          errMsg={errMsg}
          setErrMsg={setErrMsg}
        />
        <CycleTestsInfos
          formDatas={itemInfos}
          setFormDatas={setItemInfos}
          errMsg={errMsg}
          setErrMsg={setErrMsg}
        />
        <CycleEvents
          formDatas={itemInfos}
          setFormDatas={setItemInfos}
          errMsg={errMsg}
          setErrMsg={setErrMsg}
        />
        <CycleNotes
          formDatas={itemInfos}
          setFormDatas={setItemInfos}
          errMsg={errMsg}
          setErrMsg={setErrMsg}
        />
        <div className="cycles-form__btn-container">
          <SaveButton onClick={handleSave} disabled={progress} />
          <PrintButton onClick={handlePrint} disabled={progress} />
          <CloseButton onClick={handleClose} disabled={progress} />
          {progress && <CircularProgressSmall />}
        </div>
      </form>
    )
  );
};

export default CycleDetails;
