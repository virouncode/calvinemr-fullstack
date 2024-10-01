import React, { useState } from "react";
import { useDashboardMedications } from "../../../hooks/reactquery/queries/dashboardQueries";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";

import { getTop10Meds } from "../../../utils/dashboard/getTop10Meds";
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

const DashboardCardMeds = () => {
  //Hooks
  const [siteSelectedIdMeds, setSiteSelectedIdMeds] = useState(-1);
  const [rangeStartMeds, setRangeStartMeds] = useState(getStartOfTheMonthTZ());
  const [rangeEndMeds, setRangeEndMeds] = useState(getEndOfTheMonthTZ());
  //Queries
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

  const handleChangeStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    setRangeStartMeds(dateISOToTimestampTZ(value) as number);
  };
  const handleChangeEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;
    setRangeEndMeds(dateISOToTimestampTZ(value) as number);
  };
  const handleSiteChangeMeds = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
          errorMsg={errorSites?.message || errorMedications?.message || ""}
        />
      </div>
    );

  const top10Meds = getTop10Meds(medications, sites, siteSelectedIdMeds);

  return (
    <div className="dashboard-card">
      <div className="dashboard-card__title">Medications</div>
      <div className="dashboard-card__filter">
        <DashboardDateFilter
          rangeStart={rangeStartMeds}
          rangeEnd={rangeEndMeds}
          onChangeStart={handleChangeStart}
          onChangeEnd={handleChangeEnd}
        />
      </div>
      {medications && medications.length > 0 ? (
        <div className="dashboard-card__content">
          <DashboardCardRanking
            title="Top medications"
            handleSiteChange={handleSiteChangeMeds}
            sites={sites}
            siteSelectedId={siteSelectedIdMeds}
            top10Infos={top10Meds}
          />
        </div>
      ) : (
        <EmptyParagraph text="No meds in this range" />
      )}
    </div>
  );
};

export default DashboardCardMeds;
