import { BarChart } from "@mui/x-charts/BarChart";
import React from "react";
import {
  useDashboardPatientsPerAge,
  useDashboardPatientsPerGender,
} from "../../../hooks/reactquery/queries/dashboardQueries";
import { SiteType } from "../../../types/api";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";

type DashboardCardPatientsProps = {
  sites: SiteType[];
};

const DashboardCardPatients = ({ sites }: DashboardCardPatientsProps) => {
  //Queries
  const {
    data: patientsPerGender,
    isPending: isPendingPatientsPerGender,
    error: errorPatientsPerGender,
  } = useDashboardPatientsPerGender(sites);
  const {
    data: patientsPerAge,
    isPending: isPendingPatientsPerAge,
    error: errorPatientsPerAge,
  } = useDashboardPatientsPerAge(sites);

  if (isPendingPatientsPerGender || isPendingPatientsPerAge)
    return (
      <div className="dashboard-card">
        <div className="dashboard-card__title">Patients</div>
        <LoadingParagraph />
      </div>
    );

  if (errorPatientsPerGender || errorPatientsPerAge)
    return (
      <div className="dashboard-card">
        <div className="dashboard-card__title">Patients</div>
        <ErrorParagraph
          errorMsg={
            errorPatientsPerGender?.message ||
            errorPatientsPerAge?.message ||
            ""
          }
        />
      </div>
    );

  return (
    <div className="dashboard-card">
      <div className="dashboard-card__title">Patients</div>
      <div className="dashboard-card__total">
        <label>Total patients: </label>
        {patientsPerGender.length > 0
          ? patientsPerGender.slice(-1)[0]["M"] +
            patientsPerGender.slice(-1)[0]["F"] +
            patientsPerGender.slice(-1)[0]["O"]
          : "0"}
      </div>
      <div className="dashboard-card__content">
        <div className="dashboard-card__chart">
          <p className="dashboard-card__chart-title">By gender</p>

          {patientsPerGender && patientsPerGender?.length > 0 ? (
            <BarChart
              dataset={patientsPerGender}
              series={[
                { dataKey: "M", label: "Males" },
                { dataKey: "F", label: "Females" },
                { dataKey: "O", label: "Others" },
              ]}
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
            <EmptyParagraph text="No patients by gender available" />
          )}
        </div>
        <div className="dashboard-card__chart">
          <p className="dashboard-card__chart-title">By age range</p>

          {patientsPerAge && patientsPerAge?.length > 0 ? (
            <BarChart
              dataset={patientsPerAge}
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
                  label: "people",
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
            <EmptyParagraph text="No patients by age available" />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCardPatients;
