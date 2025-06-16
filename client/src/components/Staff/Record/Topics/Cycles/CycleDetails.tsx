import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import xanoGet from "../../../../../api/xanoCRUD/xanoGet";
import { xanoPost } from "../../../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  CareElementType,
  CycleType,
  DemographicsType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import { cycleSchema } from "../../../../../validation/cycles/cycleValidation";
import CancelButton from "../../../../UI/Buttons/CancelButton";
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

type CycleDetailsProps = {
  cycleToShow: CycleType;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  demographicsInfos: DemographicsType;
  topicPut: UseMutationResult<CycleType, Error, CycleType, void>;
  patientId: number;
};

const CycleDetails = ({
  cycleToShow,
  setShow,
  demographicsInfos,
  topicPut,
  patientId,
}: CycleDetailsProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
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
      events: itemInfos.events?.map(({ id, ...event }) => event) ?? [],
      notes: itemInfos.notes?.map(({ id, ...note }) => note) ?? [],
    };
    setProgress(true);
    topicPut.mutate(cycleToPut, {
      onError: () => setProgress(false),
    });
    //post e2, lh, p4 to Care elements

    try {
      const careElementsDatas: CareElementType = (
        await xanoGet("/care_elements_of_patient", "staff", {
          patient_id: patientId,
          page: 1,
        })
      ).items?.[0];
      const regex = /^\d+(\.\d{0,2})?$/;
      if (careElementsDatas) {
        for (const event of itemInfos.events ?? []) {
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
        setShow(false);
      } else {
        if (
          itemInfos.events &&
          itemInfos.events.length &&
          itemInfos.events.some(
            (event) =>
              (event.e2 && !regex.test(event.e2)) ||
              (event.lh && !regex.test(event.lh)) ||
              (event.p4 && !regex.test(event.p4))
          )
        ) {
          setErrMsg("Invalid E2, LH or P4 value. Please enter a valid number.");
          setProgress(false);
          return;
        }
        const careElementsToPost: Partial<CareElementType> = {
          patient_id: patientId,
          date_created: nowTZTimestamp(),
          created_by_id: user.id,
          E2: itemInfos.events
            ? itemInfos.events
                .filter((event) => event.e2)
                .map((event) => ({
                  Date: event.date as number,
                  E2: event.e2,
                  E2Unit: "pmol/L",
                }))
            : [],
          LH: itemInfos.events
            ? itemInfos.events
                .filter((event) => event.lh)
                .map((event) => ({
                  Date: event.date as number,
                  LH: event.lh,
                  LHUnit: "IU/L",
                }))
            : [],
          P4: itemInfos.events
            ? itemInfos.events
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
        setShow(false);
      }
    } catch (err) {
      if (err instanceof Error)
        setErrMsg(`Unable to save cycle: ${err.message}`);
      setProgress(false);
    }
  };
  const handleCancel = async () => {
    if (
      await confirmAlert({
        content:
          "Do you really want to close the window ? Your changes will be lost",
      })
    ) {
      setShow(false);
    }
  };
  return (
    itemInfos && (
      <>
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
          <CycleBillingInfos
            formDatas={itemInfos}
            setFormDatas={setItemInfos}
            errMsg={errMsg}
            setErrMsg={setErrMsg}
          />
          <div className="cycles-form__btn-container">
            <SaveButton onClick={handleSave} disabled={progress} />
            <CancelButton onClick={handleCancel} disabled={progress} />
            {progress && <CircularProgressSmall />}
          </div>
        </form>
      </>
    )
  );
};

export default CycleDetails;
