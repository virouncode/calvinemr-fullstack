import { BarChart } from "@mui/x-charts";
import React, { useState } from "react";
import { useDashboardCycles } from "../../../hooks/reactquery/queries/dashboardQueries";
import { SiteType } from "../../../types/api";
import {
  dateISOToTimestampTZ,
  getEndOfTheMonthTZ,
  getStartOfTheMonthTZ,
} from "../../../utils/dates/formatDates";
import { cycleTypes } from "../../UI/Lists/CycleTypeList";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import DashboardDateFilter from "./DashboardDateFilter";
const colorsPalette = [
  "#0CB2AF",
  "#2E96FF",
  "#B800D8",
  "#60009B",
  "#2731C8",
  "#ffe119",
  "#e6194b",
  "#3cb44b",
  "#f58231",
  "#911eb4",
  "#42d4f4",
  "#f032e6",
  "#bfef45",
  "#fabebe",
  "#469990",
  "#e6beff",
  "#9A6324",
];

type DashboardCardCyclesProps = {
  sites: SiteType[];
};

const DashboardCardCycles = ({ sites }: DashboardCardCyclesProps) => {
  //Hooks
  const [rangeStartCycles, setRangeStartCycles] = useState(
    getStartOfTheMonthTZ()
  );
  const [rangeEndCycles, setRangeEndCycles] = useState(getEndOfTheMonthTZ());
  const [siteSelectedId, setSiteSelectedId] = useState(-1);
  //Queries
  const {
    data: cycles,
    isPending: isPendingCycles,
    error: errorCycles,
  } = useDashboardCycles(sites, rangeStartCycles, rangeEndCycles);

  const handleChangeStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    setRangeStartCycles(dateISOToTimestampTZ(value) as number);
  };
  const handleChangeEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    setRangeEndCycles((dateISOToTimestampTZ(value) as number) + 86399999);
  };

  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSiteSelectedId(parseInt(e.target.value));
  };

  if (isPendingCycles)
    return (
      <div className="dashboard-card">
        <div className="dashboard-card__title">Cycles</div>
        <LoadingParagraph />
      </div>
    );

  if (errorCycles)
    return (
      <div className="dashboard-card">
        <div className="dashboard-card__title">Cycles</div>
        <ErrorParagraph errorMsg={errorCycles?.message} />
      </div>
    );

  const totalCycles =
    cycles.length > 0
      ? Object.values(cycles[cycles.length - 1]).reduce(
          (acc, currentValue) => acc + currentValue
        )
      : 0;
  console.log("totalCycles", totalCycles);

  return (
    <div className="dashboard-card">
      <div className="dashboard-card__title">ART Cycles</div>
      <div className="dashboard-card__filter">
        <DashboardDateFilter
          rangeStart={rangeStartCycles}
          rangeEnd={rangeEndCycles}
          onChangeStart={handleChangeStart}
          onChangeEnd={handleChangeEnd}
        />
        <div className="dashboard-card__filter-total">
          <label>Total cycles: </label>
          {totalCycles}
        </div>
      </div>
      {totalCycles > 0 ? (
        <div className="dashboard-card__content">
          <div className="dashboard-card__chart">
            <p className="dashboard-card__chart-title">Cycles</p>

            <BarChart
              dataset={cycles}
              series={cycleTypes.map((cycleType, index) => ({
                dataKey: cycleType,
                label: cycleType,
                color: colorsPalette[index],
              }))}
              xAxis={[
                {
                  data: [...sites.map(({ name }) => name), "Total"],
                  scaleType: "band",
                },
              ]}
              width={500}
              height={400}
              margin={{ top: 200 }}
              slotProps={{
                legend: {
                  direction: "row",
                  position: {
                    vertical: "top",
                    horizontal: "middle",
                  },
                  labelStyle: {
                    fontSize: 12,
                  },
                  itemMarkWidth: 10,
                  itemMarkHeight: 10,
                  markGap: 5,
                  itemGap: 10,
                },
              }}
            />
          </div>
        </div>
      ) : (
        <EmptyParagraph text="No cycles in this range" />
      )}
    </div>
  );
};

export default DashboardCardCycles;
