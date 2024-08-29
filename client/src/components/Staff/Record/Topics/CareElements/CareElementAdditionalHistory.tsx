import { LineChart } from "@mui/x-charts/LineChart";
import React from "react";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/strings/firstLetterUpper";

type CareElementAdditionalHistoryProps = {
  historyTopic: string;
  historyDatas: { Value: string; Date: number }[];
  historyUnit: string;
};

const CareElementAdditionalHistory = ({
  historyTopic,
  historyDatas,
  historyUnit,
}: CareElementAdditionalHistoryProps) => {
  const datasToPlot = historyDatas.map((data) => ({
    Value: data.Value ? parseFloat(data.Value) : 0,
    Date: new Date(data.Date),
  }));
  const yDataKey = "Value";
  const valueFormatter = (date: Date) =>
    date.toLocaleDateString("en-CA", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  const yFormatter = (value: number) => `${value} ${historyUnit}`;

  return (
    <div className="care-elements__history-container">
      {historyDatas.length > 1 ? (
        <LineChart
          xAxis={[
            {
              dataKey: "Date",
              valueFormatter,
              label: "Date",
              scaleType: "time",
              // tickMinStep: 3600 * 1000 * 12, // min step: 24h
            },
          ]}
          series={[
            {
              dataKey: yDataKey,
              label: `${firstLetterOfFirstWordUpper(
                historyTopic.toLowerCase()
              )} (${historyUnit})`,
              type: "line",
              curve: "linear",
              color: "#76b7b2",
              valueFormatter: yFormatter,
            },
          ]}
          dataset={datasToPlot}
          width={500}
          height={350}
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
      ) : (
        <p>No previous datas</p>
      )}
    </div>
  );
};

export default CareElementAdditionalHistory;
