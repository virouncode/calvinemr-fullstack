const FaxesOverviewToolbar = ({ section }) => {
  return (
    <div className="fax-overview__toolbar">
      <div className="fax-overview__from">
        {section === "Received faxes" ? "From Fax#/Name" : "To Fax#/Name"}
      </div>
      <div className="fax-overview__pages">Nbr of pages</div>
      <div className="fax-overview__date">Date</div>
      <div className="fax-overview__fake-div"></div>
    </div>
  );
};

export default FaxesOverviewToolbar;
