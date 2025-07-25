import { UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import xanoGet from "../../../../../api/xanoCRUD/xanoGet";
import { xanoPost } from "../../../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  CareElementType,
  CycleType,
  DemographicsType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { initialCycle } from "../../../../../utils/initialDatas/initialDatas";
import { cycleSchema } from "../../../../../validation/cycles/cycleValidation";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressSmall from "../../../../UI/Progress/CircularProgressSmall";
import CycleBillingInfos from "./CycleBillingInfos";
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
  const { staffInfos } = useStaffInfosContext();
  const { socket } = useSocketContext();
  const [progress, setProgress] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [formDatas, setFormDatas] = useState<Partial<CycleType>>(
    initialCycle(demographicsInfos, staffInfos)
  );

  const handleSubmit = async () => {
    if (progress) return;
    setErrMsg("");
    try {
      await cycleSchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    setProgress(true);
    const cycleToPost: Partial<CycleType> = {
      ...formDatas,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
      cycle_nbr: `${demographicsInfos.ChartNumber}-${formDatas.cycle_nbr}`,
    };

    topicPost.mutate(cycleToPost, {
      onSuccess: async () => {
        try {
          const careElementsDatas: CareElementType = (
            await xanoGet("/care_elements_of_patient", "staff", {
              patient_id: patientId,
              page: 1,
            })
          ).items?.[0];
          const regex = /^\d+(\.\d{0,5})?$/;
          if (careElementsDatas) {
            for (const event of formDatas.events ?? []) {
              if (event.e2) {
                if (!regex.test(event.e2.toString())) {
                  setErrMsg("Invalid E2 value. Please enter a valid number.");
                  setProgress(false);
                  return;
                }
                const e2Data = careElementsDatas?.E2.find(
                  (data: { E2: string; Date: number; E2Unit: "pmol/L" }) =>
                    data.Date === event.date
                );
                if (e2Data) {
                  e2Data.E2 = event.e2;
                } else {
                  careElementsDatas?.E2.push({
                    Date: event.date as number,
                    E2: event.e2,
                    E2Unit: "pmol/L",
                  });
                }
              }
              if (event.lh) {
                if (!regex.test(event.lh.toString())) {
                  setErrMsg("Invalid LH value. Please enter a valid number.");
                  setProgress(false);
                  return;
                }
                const lhData = careElementsDatas?.LH.find(
                  (data: { LH: string; Date: number; LHUnit: "IU/L" }) =>
                    data.Date === event.date
                );
                if (lhData) {
                  lhData.LH = event.lh;
                } else {
                  careElementsDatas?.LH.push({
                    Date: event.date as number,
                    LH: event.lh,
                    LHUnit: "IU/L",
                  });
                }
              }
              if (event.p4) {
                console.log("event.p4", event.p4);

                if (!regex.test(event.p4.toString())) {
                  setErrMsg("Invalid P4 value. Please enter a valid number.");
                  setProgress(false);
                  return;
                }
                const p4Data = careElementsDatas?.P4.find(
                  (data: { P4: string; Date: number; P4Unit: "ng/mL" }) =>
                    data.Date === event.date
                );
                if (p4Data) {
                  p4Data.P4 = event.p4;
                } else {
                  careElementsDatas?.P4.push({
                    Date: event.date as number,
                    P4: event.p4,
                    P4Unit: "ng/mL",
                  });
                }
              }
            }
            const careElementsToPut = {
              ...careElementsDatas,
              updates: [
                ...(careElementsDatas?.updates ?? []),
                { updated_by_id: user.id, date_updated: nowTZTimestamp() },
              ],
            };
            await xanoPut(
              `/care_elements/${careElementsDatas.id}`,
              "staff",
              careElementsToPut
            );
            socket?.emit("message", { key: ["CARE ELEMENTS", patientId] });
            setProgress(false);
            setAddVisible(false);
          } else {
            if (
              formDatas.events &&
              formDatas.events.length &&
              formDatas.events?.some(
                (event) =>
                  (event.e2 && !regex.test(event.e2)) ||
                  (event.lh && !regex.test(event.lh)) ||
                  (event.p4 && !regex.test(event.p4))
              )
            ) {
              setErrMsg(
                "Invalid E2, LH or P4 value. Please enter a valid number."
              );
              setProgress(false);
              return;
            }
            const careElementsToPost: Partial<CareElementType> = {
              patient_id: patientId,
              date_created: nowTZTimestamp(),
              created_by_id: user.id,
              E2: formDatas.events
                ? formDatas.events
                    .filter((event) => event.e2)
                    .map((event) => ({
                      Date: event.date as number,
                      E2: event.e2,
                      E2Unit: "pmol/L",
                    }))
                : [],
              LH: formDatas.events
                ? formDatas.events
                    .filter((event) => event.lh)
                    .map((event) => ({
                      Date: event.date as number,
                      LH: event.lh,
                      LHUnit: "IU/L",
                    }))
                : [],
              P4: formDatas.events
                ? formDatas.events
                    ?.filter((event) => event.p4)
                    .map((event) => ({
                      Date: event.date as number,
                      P4: event.p4,
                      P4Unit: "ng/mL",
                    }))
                : [],
            };
            await xanoPost("/care_elements", "staff", careElementsToPost);
            socket?.emit("message", { key: ["CARE ELEMENTS", patientId] });
            setProgress(false);
            setAddVisible(false);
          }
        } catch (err) {
          if (err instanceof Error)
            setErrMsg(`Unable to save cycle: ${err.message}`);
          setProgress(false);
        }
      },
      onError: (error) => {
        setErrMsg(`Unable to save cycle: ${error.message}`);
        setProgress(false);
      },
    });
  };

  const handleClose = async () => {
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
      <CycleBillingInfos
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
