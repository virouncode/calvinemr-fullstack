import { useState } from "react";
import { useDashboardMedications } from "../../../hooks/reactquery/queries/dashboardQueries";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import { getTop10Meds } from "../../../utils/dashboard/getTop10Meds";
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

const DashboardCardMeds = () => {
  const [siteSelectedIdMeds, setSiteSelectedIdMeds] = useState(0);
  const [rangeStartMeds, setRangeStartMeds] = useState(getStartOfTheMonthTZ());
  const [rangeEndMeds, setRangeEndMeds] = useState(getEndOfTheMonthTZ());
  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();

  const {
    data: medications,
    isPending: isPendingMedications,
    error: errorMedications,
  } = useDashboardMedications(rangeStartMeds, rangeEndMeds);

  const handleChangeStart = (e) => {
    const value = e.target.value;
    setRangeStartMeds(value === "" ? null : dateISOToTimestampTZ(value));
  };
  const handleChangeEnd = (e) => {
    const value = e.target.value;
    setRangeEndMeds(value === "" ? null : dateISOToTimestampTZ(value));
  };
  const handleSiteChangeMeds = (e) => {
    setSiteSelectedIdMeds(parseInt(e.target.value));
  };

  if (isPendingSites || isPendingMedications)
    return (
      <div className="dashboard-card">
        <div className="dashboard-card__title">Medications</div>
        <LoadingParagraph />
      </div>
    );

  if (errorSites || errorMedications)
    return (
      <div className="dashboard-card">
        <div className="dashboard-card__title">Medications</div>
        <ErrorParagraph
          errorMsg={errorSites?.message || errorMedications?.message}
        />
      </div>
    );

  const top10Meds = getTop10Meds(medications, sites, siteSelectedIdMeds);

  return (
    <div className="dashboard-card">
      <div className="dashboard-card__title">Medications</div>
      <div className="dashboard-card__filter">
        <div>
          <InputDate
            value={timestampToDateISOTZ(rangeStartMeds)}
            onChange={handleChangeStart}
            name="from"
            id="from"
            label="From"
          />
          <InputDate
            value={timestampToDateISOTZ(rangeEndMeds)}
            onChange={handleChangeEnd}
            name="to"
            id="to"
            label="To"
          />
        </div>
      </div>

      {medications && medications.length > 0 ? (
        <div className="dashboard-card__content">
          <div className="dashboard-card__ranking">
            <p className="dashboard-card__ranking-title">Top medications</p>
            <SiteSelect
              handleSiteChange={handleSiteChangeMeds}
              sites={sites}
              value={siteSelectedIdMeds}
              all={true}
            />
            {top10Meds && top10Meds.length > 0 ? (
              <ul className="dashboard-card__ranking-content">
                {top10Meds.map((item, index) => (
                  <li key={item.id} className="dashboard-card__ranking-item">
                    <span
                      className="dashboard-card__ranking-item-nbr"
                      style={{ width: "20px" }}
                    >
                      {index + 1}:
                    </span>
                    <span>
                      {item.medication} ({item.frequency})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyParagraph text="Not enough datas" />
            )}
          </div>
        </div>
      ) : (
        <EmptyParagraph text="No meds in this range" />
      )}
    </div>
  );
};

export default DashboardCardMeds;
