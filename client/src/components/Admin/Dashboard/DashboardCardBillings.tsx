import { BarChart } from "@mui/x-charts/BarChart";
import React, { useState } from "react";
import { useDashboardBillings } from "../../../hooks/reactquery/queries/dashboardQueries";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import { getRevenues } from "../../../utils/dashboard/getRevenues";
import { getTop10BillingCodes } from "../../../utils/dashboard/getTop10BillingCodes";
import { getTop10Diagnosis } from "../../../utils/dashboard/getTop10Diagnoses";
import {
  dateISOToTimestampTZ,
  getEndOfTheMonthTZ,
  getStartOfTheMonthTZ,
} from "../../../utils/dates/formatDates";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import DashboardCardRanking from "./DashboardCardRanking";
import DashboardDateFilter from "./DashboardDateFilter";

const DashboardCardBillings = () => {
  const [rangeStartBillings, setRangeStartBillings] = useState(
    getStartOfTheMonthTZ()
  );
  const [rangeEndBillings, setRangeEndBillings] = useState(
    getEndOfTheMonthTZ()
  );
  const [siteSelectedIdDiagnoses, setSiteSelectedIdDiagnoses] = useState(0);
  const [siteSelectedIdBillingCodes, setSiteSelectedIdBillingCodes] =
    useState(0);

  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();

  const {
    data: billings,
    isPending: isPendingBillings,
    error: errorBillings,
  } = useDashboardBillings(rangeStartBillings, rangeEndBillings);

  if (isPendingSites || isPendingBillings)
    return (
      <div className="dashboard-card">
        <div className="dashboard-card__title">Billings</div>
        <LoadingParagraph />
      </div>
    );

  if (errorSites || errorBillings)
    return (
      <div className="dashboard-card">
        <div className="dashboard-card__title">Billings</div>
        <ErrorParagraph
          errorMsg={errorSites?.message || errorBillings?.message || ""}
        />
      </div>
    );

  const revenues = getRevenues(billings, sites);
  const top10Diagnosis = getTop10Diagnosis(
    billings,
    sites,
    siteSelectedIdDiagnoses
  );
  const top10BillingCodes = getTop10BillingCodes(
    billings,
    sites,
    siteSelectedIdBillingCodes
  );

  const handleChangeStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRangeStartBillings(dateISOToTimestampTZ(value));
  };
  const handleChangeEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRangeEndBillings(dateISOToTimestampTZ(value));
  };
  const handleSiteChangeDiagnoses = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSiteSelectedIdDiagnoses(parseInt(e.target.value));
  };
  const handleSiteChangeBillingCodes = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSiteSelectedIdBillingCodes(parseInt(e.target.value));
  };
  return (
    <div className="dashboard-card">
      <div className="dashboard-card__title">Billings</div>
      <div className="dashboard-card__filter">
        <DashboardDateFilter
          rangeStart={rangeStartBillings}
          rangeEnd={rangeEndBillings}
          onChangeStart={handleChangeStart}
          onChangeEnd={handleChangeEnd}
        />
        {billings.length > 0 ? (
          <div>
            <label>Total revenues: </label>
            {billings.reduce(
              (acc, current) =>
                acc +
                (current.billing_infos?.anaesthetist_fee ?? 0) +
                (current.billing_infos?.assistant_fee ?? 0) +
                (current.billing_infos?.non_anaesthetist_fee ?? 0) +
                (current.billing_infos?.provider_fee ?? 0) +
                (current.billing_infos?.specialist_fee ?? 0),
              0
            ) / 1000}
            {" $"}
          </div>
        ) : (
          <div>No revenues</div>
        )}
      </div>
      {billings && billings.length > 0 ? (
        <div className="dashboard-card__content">
          <DashboardCardRanking
            title="Top diagnoses"
            handleSiteChange={handleSiteChangeDiagnoses}
            sites={sites}
            siteSelectedId={siteSelectedIdDiagnoses}
            top10Infos={top10Diagnosis}
          />
          <DashboardCardRanking
            title="Top billing codes"
            handleSiteChange={handleSiteChangeBillingCodes}
            sites={sites}
            siteSelectedId={siteSelectedIdBillingCodes}
            top10Infos={top10BillingCodes}
          />
          <div
            className="dashboard-card__chart"
            style={{ width: "100%", marginTop: "20px" }}
          >
            <p className="dashboard-card__chart-title">Revenues</p>
            {revenues.length > 0 ? (
              <BarChart
                dataset={revenues}
                series={[
                  {
                    dataKey: "revenue",
                    label: "Revenue",
                    valueFormatter: (value) => `${value} $`,
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
                    label: "dollars",
                  },
                ]}
                width={500}
                height={350}
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
              <EmptyParagraph text="No revenue available" />
            )}
          </div>
        </div>
      ) : (
        <EmptyParagraph text="No billings in this range" />
      )}
    </div>
  );
};

export default DashboardCardBillings;
