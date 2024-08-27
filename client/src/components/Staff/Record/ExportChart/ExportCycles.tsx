import React from "react";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import { useFetchAllPages } from "../../../../hooks/reactquery/useFetchAllPages";
import { DemographicsType } from "../../../../types/api";
import CyclePrint from "../Topics/Cycles/CyclePrint";

type ExportCyclesProps = {
  patientId: number;
  patientInfos: DemographicsType;
};

const ExportCycles = ({ patientId, patientInfos }: ExportCyclesProps) => {
  const CARD_STYLE = {
    width: "95%",
    margin: "20px auto",
    border: "solid 1px #cecdcd",
    borderRadius: "6px",
    overflow: "hidden",
    fontFamily: "Lato, Arial,sans-serif",
  };
  const TITLE_STYLE = {
    fontWeight: "bold",
    padding: "10px",
    color: "#FEFEFE",
    backgroundColor: "#00BA95",
  };
  const CONTENT_STYLE = {
    padding: "10px",
  };
  //Queries
  const { data, isPending, error, fetchNextPage, hasNextPage } = useTopic(
    "CYCLES",
    patientId
  );

  useFetchAllPages(fetchNextPage, hasNextPage);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const topicDatas = data.pages.flatMap((page) => page.items);
  return (
    <div style={CARD_STYLE}>
      <p style={TITLE_STYLE}>CYCLES</p>
      <div style={CONTENT_STYLE}>
        {topicDatas.length > 0
          ? topicDatas.map((cycle) => (
              <CyclePrint
                cycle={cycle}
                patientInfos={patientInfos}
                key={cycle.id}
                toPrint={false}
              />
            ))
          : "No cycles"}
      </div>
    </div>
  );
};

export default ExportCycles;
