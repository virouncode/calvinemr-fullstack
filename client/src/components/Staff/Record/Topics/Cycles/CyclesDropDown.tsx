import React, { useState } from "react";
import { useTopicPut } from "../../../../../hooks/reactquery/mutations/topicMutations";
import { CycleType, DemographicsType } from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import CycleDetails from "./CycleDetails";

type CycleDropDownProps = {
  data: CycleType[];
  demographicsInfos: DemographicsType;
};

const CycleDropDown = ({ data, demographicsInfos }: CycleDropDownProps) => {
  const [cycleToShow, setCycleToShow] = useState<CycleType | undefined>();
  const [show, setShow] = useState(false);

  const handleClickCycle = (cycle: CycleType) => {
    setCycleToShow(cycle);
    setShow(true);
  };
  const topicPut = useTopicPut("CYCLES", demographicsInfos.patient_id);

  return (
    <>
      <div className="topic-content">
        {data && data.length >= 1 ? (
          <ul>
            {data.slice(0, 4).map((item) => (
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
          width={window.innerWidth}
          height={window.innerHeight}
          x={0}
          y={0}
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
