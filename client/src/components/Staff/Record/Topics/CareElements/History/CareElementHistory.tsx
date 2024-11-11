import { LineChart } from "@mui/x-charts";
import React from "react";
import { CareElementHistoryTopicType } from "../../../../../../types/api";
import { toYDataKey } from "../../../../../../utils/charts/toYDataKey";

type HistoryDataType = {
  Date: number;
  [key: string]: string | number;
};

type CareElementHistoryProps = {
  historyTopic: CareElementHistoryTopicType;
  historyDatas: HistoryDataType[] | HistoryDataType[][];
  historyUnit: string | string[];
};

const CareElementHistory = ({
  historyTopic,
  historyDatas,
  historyUnit,
}: CareElementHistoryProps) => {
  //X-axis
  let xDatas: number[] = [];
  if (historyTopic === "E2" || historyTopic === "LH" || historyTopic === "P4") {
    const E2Datas = historyDatas[0] as HistoryDataType[];
    const LHDatas = historyDatas[1] as HistoryDataType[];
    const P4Datas = historyDatas[2] as HistoryDataType[];
    const flatDatas = [...E2Datas, ...LHDatas, ...P4Datas];
    xDatas = [
      ...new Set(
        flatDatas.sort((a, b) => a.Date - b.Date).map((item) => item.Date)
      ),
    ];
  } else {
    xDatas = (historyDatas as HistoryDataType[])
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

  if (historyTopic === "BLOOD PRESSURE") {
    const systolicData = (historyDatas as HistoryDataType[])
      .sort((a, b) => a.Date - b.Date)
      .map((item) => parseFloat(item.SystolicBP as string));
    const diastolicData = (historyDatas as HistoryDataType[])
      .sort((a, b) => a.Date - b.Date)
      .map((item) => parseFloat(item.DiastolicBP as string));
    const yDatas = [systolicData, diastolicData];
    series = yDatas.map((item, index) => ({
      data: item,
      label: `${index === 0 ? "Systolic" : "Diastolic"} (${historyUnit})`,
      type: "line" as const,
      curve: "linear" as const,
      color: index === 0 ? "#76b7b2" : "#ff5678",
    }));
  } else if (
    historyTopic === "E2" ||
    historyTopic === "LH" ||
    historyTopic === "P4"
  ) {
    const E2Datas = (historyDatas[0] as HistoryDataType[]).sort(
      (a, b) => a.Date - b.Date
    );
    const LHDatas = (historyDatas[1] as HistoryDataType[]).sort(
      (a, b) => a.Date - b.Date
    );
    const P4Datas = (historyDatas[2] as HistoryDataType[]).sort(
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
        historyUnit[index]
      })`,
      type: "line" as const,
      curve: "linear" as const,
      color: index === 0 ? "#76b7b2" : index === 1 ? "#ff5678" : "#5fa5f9",
    }));
  } else {
    series = [
      {
        data: (historyDatas as HistoryDataType[])
          .sort((a, b) => a.Date - b.Date)
          .map((item) => parseFloat(item[toYDataKey(historyTopic)] as string)),
        label: `${historyTopic
          .replace("LBS", "")
          .replace("FEET", "")} (${historyUnit})`,
        type: "line" as const,
        curve: historyTopic.includes("STATUS")
          ? ("stepAfter" as const)
          : ("linear" as const),
        color: "#76b7b2",
      },
    ];
  }

  return (
    <div className="care-elements__history-container">
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
{
  /*<LineChart
        // xAxis={xAxis}
        // series={series}
        // width={500}
        // height={350}
        // xAxis={[
        //   {
        //     dataKey: "Date",
        //     valueFormatter,
        //     label: "Date",
        //     scaleType: "time",
        //     // tickMinStep: 3600 * 1000 * 12, // min step: 24h
        //   },
        // ]}

        // series={
        //   historyTopic !== "BLOOD PRESSURE"
        //     ? [
        //         {
        //           dataKey: yDataKey,
        //           label: `${historyTopic
        //             .replace("LBS", "")
        //             .replace("FEET", "")} (${historyUnit})`,
        //           type: "line",
        //           curve: historyTopic.includes("STATUS")
        //             ? "stepAfter"
        //             : "linear",
        //           color: "#76b7b2",
        //           valueFormatter: yFormatter,
        //         },
        //       ]
        //     : Object.keys(keyToLabel).map((key) => ({
        //         dataKey: key,
        //         label: `${
        //           keyToLabel[key as "SystolicBP" | "DiastolicBP"]
        //         } (${historyUnit})`,
        //         type: "line",
        //         curve: historyTopic.includes("STATUS") ? "stepAfter" : "linear",
        //         color: colors[key as "SystolicBP" | "DiastolicBP"],
        //         valueFormatter: yFormatter,
        //       }))
        // }
        // dataset={datasToPlot}

        // sx={{
        //   ".MuiLineElement-root": {
        //     strokeWidth: 2,
        //   },
        //   ".MuiMarkElement-root": {
        //     stroke: "#8884d8",
        //     scale: "0.6",
        //     fill: "#fff",
        //     strokeWidth: 2,
        //   },
        // }}
        // slotProps={{
        //   legend: {
        //     direction: "row",
        //     position: {
        //       vertical: "top",
        //       horizontal: "right",
        //     },
        //     labelStyle: {
        //       fontSize: 12,
        //     },
        //     itemMarkWidth: 20,
        //     itemMarkHeight: 2,
        //     markGap: 5,
        //     itemGap: 10,
        //   },
        // }}
      />
    </div>
  );*/
}

export default CareElementHistory;
