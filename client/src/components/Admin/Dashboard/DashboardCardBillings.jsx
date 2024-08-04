import { BarChart } from "@mui/x-charts/BarChart";
import { useState } from "react";
import { useDashboardBillings } from "../../../hooks/reactquery/queries/dashboardQueries";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import { getRevenues } from "../../../utils/dashboard/getRevenues";
import { getTop10BillingCodes } from "../../../utils/dashboard/getTop10BillingCodes";
import { getTop10Diagnosis } from "../../../utils/dashboard/getTop10Diagnoses";
import {
  dateISOToTimestampTZ,
  getEndOfTheMonthTZ,
  getStartOfTheMonthTZ,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import SiteSelect from "../../Staff/EventForm/SiteSelect";
import InputDate from "../../UI/Inputs/InputDate";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";

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
          errorMsg={errorSites?.message || errorBillings?.message}
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

  const chartSetting = {
    xAxis: [
      {
        data: [...sites.map(({ name }) => name), "Total"],
        scaleType: "band",
      },
    ],
    yAxis: [
      {
        label: "dollars",
      },
    ],
    width: 500,
    height: 350,
    slotProps: {
      legend: {
        direction: "row",
        position: {
          vertical: "top",
          horizontal: "center",
        },
        labelStyle: {
          fontSize: 12,
        },
        itemMarkWidth: 10,
        itemMarkHeight: 10,
        markGap: 5,
        itemGap: 10,
      },
    },
  };

  const handleChangeStart = (e) => {
    const value = e.target.value;
    setRangeStartBillings(value === "" ? null : dateISOToTimestampTZ(value));
  };
  const handleChangeEnd = (e) => {
    const value = e.target.value;
    setRangeEndBillings(value === "" ? null : dateISOToTimestampTZ(value));
  };
  const handleSiteChangeDiagnoses = (e) => {
    setSiteSelectedIdDiagnoses(parseInt(e.target.value));
  };
  const handleSiteChangeBillingCodes = (e) => {
    setSiteSelectedIdBillingCodes(parseInt(e.target.value));
  };
  return (
    <div className="dashboard-card">
      <div className="dashboard-card__title">Billings</div>
      <div className="dashboard-card__filter">
        <div>
          <InputDate
            value={timestampToDateISOTZ(rangeStartBillings)}
            onChange={handleChangeStart}
            name="from"
            id="from"
            label="From"
          />
          <InputDate
            value={timestampToDateISOTZ(rangeEndBillings)}
            onChange={handleChangeEnd}
            name="to"
            id="to"
            label="To"
          />
        </div>
        {billings.length > 0 ? (
          <div>
            <label>Total revenues: </label>
            {billings.reduce(
              (acc, current) =>
                acc +
                current.billing_infos.anaesthetist_fee +
                current.billing_infos.assistant_fee +
                current.billing_infos.non_anaesthetist_fee +
                current.billing_infos.provider_fee +
                current.billing_infos.specialist_fee,
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
          <div className="dashboard-card__ranking">
            <p className="dashboard-card__ranking-title">Top diagnoses</p>
            <SiteSelect
              handleSiteChange={handleSiteChangeDiagnoses}
              sites={sites}
              value={siteSelectedIdDiagnoses}
              all={true}
            />
            {top10Diagnosis && top10Diagnosis.length > 0 ? (
              <ul className="dashboard-card__ranking-content">
                {top10Diagnosis.map((item, index) => (
                  <li key={item.id} className="dashboard-card__ranking-item">
                    <span
                      className="dashboard-card__ranking-item-nbr"
                      style={{ width: "20px" }}
                    >
                      {index + 1}:
                    </span>{" "}
                    <span>
                      {item.diagnosis} ({item.frequency})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyParagraph text="Not enough datas" />
            )}
          </div>
          <div className="dashboard-card__ranking">
            <p className="dashboard-card__ranking-title">Top billing codes</p>
            <SiteSelect
              handleSiteChange={handleSiteChangeBillingCodes}
              sites={sites}
              value={siteSelectedIdBillingCodes}
              all={true}
            />
            {top10BillingCodes && top10BillingCodes.length > 0 ? (
              <ul className="dashboard-card__ranking-content">
                {top10BillingCodes.map((item, index) => (
                  <li key={item.id} className="dashboard-card__ranking-item">
                    <span
                      className="dashboard-card__ranking-item-nbr"
                      style={{ width: "20px" }}
                    >
                      {index + 1}:
                    </span>{" "}
                    <span>
                      {item.billing_code} ({item.frequency})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyParagraph text="Not enough datas" />
            )}
          </div>
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
                {...chartSetting}
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
