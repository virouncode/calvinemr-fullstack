import { BarChart } from "@mui/x-charts/BarChart";
import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import { getStaffDuration } from "../../../utils/dashboard/getStaffDuration";
import { getStaffPerCategory } from "../../../utils/dashboard/getStaffPerCategory";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";

const DashboardCardStaff = () => {
  const { staffInfos } = useStaffInfosContext();
  const categoriesData = [
    "Doctors",
    "Medical students",
    "Nurses",
    "Nursing students",
    "Secretaries",
    "Ultra sound techs",
    "Lab techs",
    "Nutritionists",
    "Physiotherapists",
    "Psychologists",
    "Others",
  ];
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
  ];

  const { data: sites, isPending, error } = useSites();

  if (isPending)
    return (
      <div className="dashboard-card">
        <div className="dashboard-card__title">Staff members</div>
        <LoadingParagraph />
      </div>
    );
  if (error)
    return (
      <div className="dashboard-card">
        <div className="dashboard-card__title">Staff members</div>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  const staffPerCategory = getStaffPerCategory(
    staffInfos.filter(({ account_status }) => account_status !== "Closed"),
    sites
  );
  const staffDurations = getStaffDuration(
    staffInfos.filter(({ account_status }) => account_status !== "Closed"),
    sites
  );

  return (
    staffPerCategory && (
      <div className="dashboard-card">
        <div className="dashboard-card__title">Staff members</div>
        <div className="dashboard-card__total">
          <label>Total staff members: </label>
          {staffInfos.length}
        </div>
        {staffPerCategory.length > 0 && staffDurations.length > 0 ? (
          <div className="dashboard-card__content">
            <div className="dashboard-card__chart">
              <p className="dashboard-card__chart-title">By occupation</p>
              <BarChart
                dataset={staffPerCategory}
                series={categoriesData.map((category, index) => {
                  return {
                    dataKey: category,
                    label: category,
                    color: colorsPalette[index],
                  };
                })}
                xAxis={[
                  {
                    data: [...sites.map(({ name }) => name), "Total"],
                    scaleType: "band",
                  },
                ]}
                yAxis={[
                  {
                    label: "people",
                  },
                ]}
                width={500}
                height={400}
                margin={{ top: 90 }}
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
            <div className="dashboard-card__chart">
              <p className="dashboard-card__chart-title">
                By employment duration
              </p>
              <BarChart
                dataset={staffDurations}
                series={[
                  {
                    dataKey: "shortest",
                    label: "Shortest",
                    valueFormatter: (value) => `${value} days`,
                  },
                  {
                    dataKey: "longest",
                    label: "Longest",
                    valueFormatter: (value) => `${value} days`,
                  },
                ]}
                xAxis={[
                  {
                    data: [...sites.map(({ name }) => name), "Total"],
                    scaleType: "band",
                  },
                ]}
                yAxis={[
                  {
                    label: "days",
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
            </div>
          </div>
        ) : (
          <EmptyParagraph text="No staff members" />
        )}
      </div>
    )
  );
};

export default DashboardCardStaff;
