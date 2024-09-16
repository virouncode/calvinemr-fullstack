import React from "react";

type FaxesOverviewToolbarProps = {
  section: string;
};

const FaxesOverviewToolbar = ({ section }: FaxesOverviewToolbarProps) => {
  return (
    <div className="fax__overview-toolbar">
      <div className="fax__overview-from">
        {section === "Received faxes" ? "From Fax#/Name" : "To Fax#/Name"}
      </div>
      <div className="fax__overview-pages">Nbr of pages</div>
      <div className="fax__overview-date">Date</div>
      <div className="fax__overview-fake-div"></div>
    </div>
  );
};

export default FaxesOverviewToolbar;
