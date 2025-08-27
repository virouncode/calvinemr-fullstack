import React from "react";

type FaxesOverviewToolbarProps = {
  section: string;
};

const FaxesOverviewToolbar = ({ section }: FaxesOverviewToolbarProps) => {
  return (
    <div className="fax__overview-toolbar">
      <div className="fax__overview-from">
        {section === "Sent" ? "To Fax#/Name" : "From Fax#/Name"}
      </div>
      <div className="fax__overview-notes">Notes</div>
      <div className="fax__overview-date">Date</div>
      <div className="fax__overview-fake-div"></div>
    </div>
  );
};

export default FaxesOverviewToolbar;
