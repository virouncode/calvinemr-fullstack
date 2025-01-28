import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import xanoGet from "../../../../../api/xanoCRUD/xanoGet";
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
      for (const event of itemInfos.events ?? []) {
        if (event.e2) {
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
