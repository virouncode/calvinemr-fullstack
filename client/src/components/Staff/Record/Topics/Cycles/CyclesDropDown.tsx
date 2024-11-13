import { InfiniteData, UseMutationResult } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  CycleType,
  DemographicsType,
  XanoPaginatedType,
} from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import CycleDetails from "./CycleDetails";

type CycleDropDownProps = {
  topicDatas: InfiniteData<XanoPaginatedType<CycleType>, unknown> | undefined;
  isPending: boolean;
  error: Error | null;
  demographicsInfos: DemographicsType;
  topicPut: UseMutationResult<CycleType, Error, CycleType, void>;
};

const CycleDropDown = ({
  topicDatas,
  isPending,
  error,
  demographicsInfos,
  topicPut,
}: CycleDropDownProps) => {
  const [cycleToShow, setCycleToShow] = useState<CycleType | undefined>();
  const [show, setShow] = useState(false);

  const handleClickCycle = (cycle: CycleType) => {
    setCycleToShow(cycle);
    setShow(true);
  };

  if (isPending)
    return (
      <div className="topic-content">
        <CircularProgressMedium />
      </div>
    );
  if (error)
    return (
      <div className="topic-content">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  const datas = topicDatas?.pages.flatMap((page) => page.items);

  return (
    <>
      <div className="topic-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas.slice(0, 4).map((item) => (
              <li
                key={item.id}
                className="topic-content__item"
                onClick={() => handleClickCycle(item)}
                style={{
                  textDecoration: "underline",
                  color: "black",
                  cursor: "pointer",
                  fontWeight: "normal",
                }}
              >
                - Cycle number {item.cycle_nbr} ({item.cycle_type}, LMP:{" "}
                {timestampToDateISOTZ(item.lmp)})
              </li>
            ))}
            <li>...</li>
          </ul>
        ) : (
          "No cycles"
        )}
      </div>
      {show && cycleToShow && (
        <FakeWindow
          title={`ART CYCLE# ${cycleToShow?.cycle_nbr} DETAILS`}
          width={1400}
          height={800}
          x={(window.innerWidth - 1400) / 2}
          y={(window.innerHeight - 800) / 2}
          color="#2B8C99"
          setPopUpVisible={setShow}
          closeCross={false}
        >
          <CycleDetails
            setShow={setShow}
            cycleToShow={cycleToShow}
            demographicsInfos={demographicsInfos}
            topicPut={topicPut}
            patientId={demographicsInfos.patient_id}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default CycleDropDown;
