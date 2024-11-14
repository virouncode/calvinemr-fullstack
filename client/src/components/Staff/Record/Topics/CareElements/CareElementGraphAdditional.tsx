import { LineChart } from "@mui/x-charts";
import React from "react";
import { CareElementAdditionalType } from "../../../../../types/api";

type CareElementGraphAdditionalProps = {
  graphAdditionalData?: CareElementAdditionalType;
};

const CareElementGraphAdditional = ({
  graphAdditionalData,
}: CareElementGraphAdditionalProps) => {
  //X-axis
  const xDatas = (
    graphAdditionalData?.Data as { Value: string; Date: number }[]
  )
    .sort((a, b) => a.Date - b.Date)
    .map((item) => new Date(item.Date));

  const xValueFormatter = (date: Date) =>
    date.toLocaleDateString("en-CA", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });

  const xAxis = [
    {
      data: xDatas,
      valueFormatter: xValueFormatter,
      scaleType: "time" as const,
      label: "Date",
      tickMinStep: 3600 * 1000 * 24,
    },
  ];

  //Y-axis
  const series = [
    {
      data: (graphAdditionalData?.Data as { Value: string; Date: number }[])
        .sort((a, b) => a.Date - b.Date)
        .map((item) => parseFloat(item.Value)),
      label: graphAdditionalData?.Name + " (" + graphAdditionalData?.Unit + ")",
      type: "line" as const,
      curve: "linear" as const,
      color: "#76b7b2",
    },
  ];

  return (
    <div className="care-elements__graph-container">
      <LineChart
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

export default CareElementGraphAdditional;
