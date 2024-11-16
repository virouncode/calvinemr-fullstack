import React from "react";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import DashboardCardBillings from "./DashboardCardBillings";
import DashboardCardMeds from "./DashboardCardMeds";
import DashboardCardPatients from "./DashboardCardPatients";
import DashboardCardStaff from "./DashboardCardStaff";
import DashboardCardVisits from "./DashboardCardVisits";
import DashboardCardCycles from "./DashboardCardCycles";

const Dashboard = () => {
  //Queries
  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();

  if (isPendingSites) return <LoadingParagraph />;
  if (errorSites) return <ErrorParagraph errorMsg={errorSites.message} />;

  return (
    <>
      <div className="dashboard-row">
        <DashboardCardCycles sites={sites} />
      </div>
      <div className="dashboard-row">
        <DashboardCardVisits sites={sites} />
      </div>
      <div className="dashboard-row">
        <DashboardCardStaff sites={sites} />
      </div>

      <div className="dashboard-row">
        <DashboardCardPatients sites={sites} />
      </div>

      <div className="dashboard-row">
        <DashboardCardBillings sites={sites} />
      </div>
      <div className="dashboard-row">
        <DashboardCardMeds sites={sites} />
      </div>
    </>
  );
};

export default Dashboard;
