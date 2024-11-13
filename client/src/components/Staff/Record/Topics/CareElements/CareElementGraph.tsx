import { LineChart } from "@mui/x-charts";
import React from "react";
import {
  CareElementGraphDataType,
  CareElementListItemType,
} from "../../../../../types/api";
import {
  cmToFeet,
  kgToLbs,
} from "../../../../../utils/measurements/measurements";

type CareElementGraphProps = {
  graphTopic: string;
  graphData: CareElementGraphDataType[] | CareElementGraphDataType[][];
  graphUnit: string | string[];
  careElementToShow: CareElementListItemType;
};

const CareElementGraph = ({
  graphTopic,
  graphData,
  graphUnit,
  careElementToShow,
}: CareElementGraphProps) => {
  //X-axis
  let xDatas: number[] = [];
  if (graphTopic === "E2" || graphTopic === "LH" || graphTopic === "P4") {
    const E2Datas = graphData[0] as CareElementGraphDataType[];
    const LHDatas = graphData[1] as CareElementGraphDataType[];
    const P4Datas = graphData[2] as CareElementGraphDataType[];
    const flatDatas = [...E2Datas, ...LHDatas, ...P4Datas];
    xDatas = [
      ...new Set(
        flatDatas.sort((a, b) => a.Date - b.Date).map((item) => item.Date)
      ),
    ];
  } else {
    xDatas = (graphData as CareElementGraphDataType[])
      .sort((a, b) => a.Date - b.Date)
      .map((item) => item.Date);
  }
  const xValueFormatter = (date: Date) =>
    date.toLocaleDateString("en-CA", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });

  const xAxis = [
    {
      data: xDatas.map((item) => new Date(item)),
      valueFormatter: xValueFormatter,
      scaleType: "time" as const,
      label: "Date",
      tickMinStep: 3600 * 1000 * 24,
    },
  ];

  //Y-axis
  let series = [];

  if (graphTopic === "BloodPressure") {
    const systolicData = (graphData as CareElementGraphDataType[])
      .sort((a, b) => a.Date - b.Date)
      .map((item) => parseFloat(item.SystolicBP as string));
    const diastolicData = (graphData as CareElementGraphDataType[])
      .sort((a, b) => a.Date - b.Date)
      .map((item) => parseFloat(item.DiastolicBP as string));
    const yDatas = [systolicData, diastolicData];
    series = yDatas.map((item, index) => ({
      data: item,
      label: `${index === 0 ? "Systolic" : "Diastolic"} (mmHg)`,
      type: "line" as const,
      curve: "linear" as const,
      color: index === 0 ? "#76b7b2" : "#ff5678",
    }));
  } else if (
    graphTopic === "E2" ||
    graphTopic === "LH" ||
    graphTopic === "P4"
  ) {
    const E2Datas = (graphData[0] as CareElementGraphDataType[]).sort(
      (a, b) => a.Date - b.Date
    );
    const LHDatas = (graphData[1] as CareElementGraphDataType[]).sort(
      (a, b) => a.Date - b.Date
    );
    const P4Datas = (graphData[2] as CareElementGraphDataType[]).sort(
      (a, b) => a.Date - b.Date
    );

    const E2YDatas = xDatas.map((date) => {
      return E2Datas.find((item) => item.Date === date)
        ? parseFloat(E2Datas.find((item) => item.Date === date)?.E2 as string)
        : null;
    });
    const LHYDatas = xDatas.map((date) => {
      return LHDatas.find((item) => item.Date === date)
        ? parseFloat(LHDatas.find((item) => item.Date === date)?.LH as string)
        : null;
    });
    const P4YDatas = xDatas.map((date) => {
      return P4Datas.find((item) => item.Date === date)
        ? parseFloat(P4Datas.find((item) => item.Date === date)?.P4 as string)
        : null;
    });
    const yDatas = [E2YDatas, LHYDatas, P4YDatas];
    series = yDatas.map((item, index) => ({
      data: item,
      label: `${index === 0 ? "E2" : index === 1 ? "LH" : "P4"} (${
        graphUnit[index]
      })`,
      type: "line" as const,
      curve: "linear" as const,
      color: index === 0 ? "#76b7b2" : index === 1 ? "#ff5678" : "#5fa5f9",
    }));
  } else {
    series = [
      {
        data: (graphData as CareElementGraphDataType[])
          .sort((a, b) => a.Date - b.Date)
          .map((item) => {
            if (careElementToShow.name === "Smoking Status (Y/N)") {
              return item[careElementToShow.valueKey] === "Y" ? 1 : 0;
            } else if (careElementToShow.name === "Height (ft in)") {
              return parseFloat(
                cmToFeet(item[careElementToShow.valueKey] as string)
              );
            } else if (careElementToShow.name === "Weight (lbs)") {
              return parseFloat(
                kgToLbs(item[careElementToShow.valueKey] as string)
              );
            } else
              return parseFloat(item[careElementToShow.valueKey] as string);
          }),
        label:
          careElementToShow.name === "Height (ft in)"
            ? "Height (feet)"
            : careElementToShow.name,
        type: "line" as const,
        curve:
          careElementToShow.name === "Smoking Status (Y/N)"
            ? ("stepAfter" as const)
            : ("linear" as const),
        color: "#76b7b2",
      },
    ];
  }

  return (
    <div className="care-elements__graph-container">
      <LineChart
        onMarkClick={(e, data) => console.log(e, data)}
        xAxis={xAxis}
        series={series}
        width={500}
        height={300}
        sx={{
          ".MuiLineElement-root": {
            strokeWidth: 2,
          },
          ".MuiMarkElement-root": {
            stroke: "#8884d8",
            scale: "0.6",
            fill: "#fff",
            strokeWidth: 2,
          },
        }}
        slotProps={{
          legend: {
            direction: "row",
            position: {
              vertical: "top",
              horizontal: "right",
            },
            labelStyle: {
              fontSize: 12,
            },
            itemMarkWidth: 20,
            itemMarkHeight: 2,
            markGap: 5,
            itemGap: 10,
          },
        }}
      />
    </div>
  );
};

export default CareElementGraph;
