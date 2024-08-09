import React from "react";
import DashboardCardBillings from "./DashboardCardBillings";
import DashboardCardMeds from "./DashboardCardMeds";
import DashboardCardPatients from "./DashboardCardPatients";
import DashboardCardStaff from "./DashboardCardStaff";
import DashboardCardVisits from "./DashboardCardVisits";

const Dashboard = () => {
  return (
    <div className="dashboard">
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
    </div>
  );
};

export default Dashboard;
