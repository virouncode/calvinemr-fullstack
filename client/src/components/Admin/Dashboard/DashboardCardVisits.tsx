import { BarChart } from "@mui/x-charts/BarChart";
import React, { useState } from "react";
import { useDashboardVisits } from "../../../hooks/reactquery/queries/dashboardQueries";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import { getVisitsPerAge } from "../../../utils/dashboard/getVisitsPerAge";
import { getVisitsPerGender } from "../../../utils/dashboard/getVisitsPerGender";
import {
  dateISOToTimestampTZ,
  getEndOfTheMonthTZ,
  getStartOfTheMonthTZ,
} from "../../../utils/dates/formatDates";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import DashboardDateFilter from "./DashboardDateFilter";

const DashboardCardVisits = () => {
  //Hooks
  const [rangeStartVisits, setRangeStartVisits] = useState(
    getStartOfTheMonthTZ()
  );
  const [rangeEndVisits, setRangeEndVisits] = useState(getEndOfTheMonthTZ());
  //Queries
  const {
    data: visits,
    isPending: isPendingVisits,
    error: errorVisits,
  } = useDashboardVisits(rangeStartVisits, rangeEndVisits);
  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();

  const handleChangeStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    setRangeStartVisits(dateISOToTimestampTZ(value) as number);
  };
  const handleChangeEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    setRangeEndVisits(dateISOToTimestampTZ(value) as number);
  };

  if (isPendingSites || isPendingVisits)
    return (
      <div className="dashboard-card">
        <div className="dashboard-card__title">Visits</div>
        <LoadingParagraph />
      </div>
    );

  if (errorSites || errorVisits)
    return (
      <div className="dashboard-card">
        <div className="dashboard-card__title">Visits</div>
        <ErrorParagraph
          errorMsg={errorSites?.message || errorVisits?.message || ""}
        />
      </div>
    );

  const visitsPerGender = getVisitsPerGender(sites, visits);
  const visitsPerAge = getVisitsPerAge(sites, visits);

  return (
    <div className="dashboard-card">
      <div className="dashboard-card__title">Visits</div>
      <div className="dashboard-card__filter">
        <DashboardDateFilter
          rangeStart={rangeStartVisits}
          rangeEnd={rangeEndVisits}
          onChangeStart={handleChangeStart}
          onChangeEnd={handleChangeEnd}
        />

        <div className="dashboard-card__filter-total">
          <label>Total visits: </label>
          {visitsPerGender.length > 0
            ? visitsPerGender.slice(-1)[0].male +
              visitsPerGender.slice(-1)[0].female +
              visitsPerGender.slice(-1)[0].other
            : "0"}
        </div>
      </div>
      {visits && visits.length > 0 ? (
        <div className="dashboard-card__content">
          <div className="dashboard-card__chart">
            <p className="dashboard-card__chart-title">By gender</p>
            {visitsPerGender?.length > 0 ? (
              <BarChart
                dataset={visitsPerGender}
                series={[
                  { dataKey: "male", label: "Males" },
                  { dataKey: "female", label: "Females" },
                  { dataKey: "other", label: "Others" },
                ]}
                xAxis={[
                  {
                    data: [...sites.map(({ name }) => name), "Total"],
                    scaleType: "band",
                  },
                ]}
                yAxis={[
                  {
                    label: "visits",
                  },
                ]}
                width={500}
                height={400}
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
            ) : (
              <EmptyParagraph text="No visits per gender available" />
            )}
          </div>
          <div className="dashboard-card__chart">
            <p className="dashboard-card__chart-title">By age range</p>
            {visitsPerAge.length > 0 ? (
              <BarChart
                dataset={visitsPerAge}
                series={[
                  { dataKey: "under18", label: "<18" },
                  { dataKey: "from18to35", label: "18-35" },
                  { dataKey: "from36to50", label: "36-50" },
                  { dataKey: "from51to70", label: "51-70" },
                  { dataKey: "over70", label: ">70" },
                ]}
                xAxis={[
                  {
                    data: [...sites.map(({ name }) => name), "Total"],
                    scaleType: "band",
                  },
                ]}
                yAxis={[
                  {
                    label: "visits",
                  },
                ]}
                width={500}
                height={400}
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
            ) : (
              <EmptyParagraph text="No visits per age available" />
            )}
          </div>
        </div>
      ) : (
        <EmptyParagraph text="No visits in this range" />
      )}
    </div>
  );
};

export default DashboardCardVisits;
