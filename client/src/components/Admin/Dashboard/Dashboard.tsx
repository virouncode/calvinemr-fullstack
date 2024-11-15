import React from "react";
import DashboardCardBillings from "./DashboardCardBillings";
import DashboardCardMeds from "./DashboardCardMeds";
import DashboardCardPatients from "./DashboardCardPatients";
import DashboardCardStaff from "./DashboardCardStaff";
import DashboardCardVisits from "./DashboardCardVisits";
import DashboardCardCycles from "./DashboardCardCycles";

const Dashboard = () => {
  return (
    <>
      <div className="dashboard-row">
        <DashboardCardCycles />
      </div>
      <div className="dashboard-row">
        <DashboardCardVisits />
      </div>
      <div className="dashboard-row">
        <DashboardCardStaff />
      </div>

      <div className="dashboard-row">
        <DashboardCardPatients />
      </div>

      <div className="dashboard-row">
        <DashboardCardBillings />
      </div>
      <div className="dashboard-row">
        <DashboardCardMeds />
      </div>
    </>
  );
};

export default Dashboard;
