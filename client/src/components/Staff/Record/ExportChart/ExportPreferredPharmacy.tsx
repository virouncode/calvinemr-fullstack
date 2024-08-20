import React from "react";
import { DemographicsType } from "../../../../types/api";

type ExportPreferredPharmacyProps = {
  demographicsInfos: DemographicsType;
};

const ExportPreferredPharmacy = ({
  demographicsInfos,
}: ExportPreferredPharmacyProps) => {
  const CARD_STYLE = {
    width: "95%",
    margin: "20px auto",
    border: "solid 1px #cecdcd",
    borderRadius: "6px",
    overflow: "hidden",
    fontFamily: "Lato, Arial,sans-serif",
  };
  const TITLE_STYLE = {
    fontWeight: "bold",
    padding: "10px",
    color: "#FEFEFE",
    backgroundColor: "#28464B",
  };
  const CONTENT_STYLE = {
    padding: "10px",
  };
  const preferredPharmacy = demographicsInfos.preferred_pharmacy;
  return (
    <div style={CARD_STYLE}>
      <p style={TITLE_STYLE}>PREFERRED PHARMACY</p>
      <div style={CONTENT_STYLE}>
        {preferredPharmacy ? (
          <span>
            {preferredPharmacy?.Name ?? ""},{" "}
            {preferredPharmacy?.Address?.Structured?.Line1 ?? ""},{" "}
            {preferredPharmacy?.Address?.Structured?.City ?? ""},{" "}
            {preferredPharmacy?.Address?.Structured?.CountrySubDivisionCode ??
              ""}
            , {preferredPharmacy?.PhoneNumber?.[0]?.phoneNumber ?? ""}
          </span>
        ) : (
          "No preferred pharmacy"
        )}
      </div>
    </div>
  );
};

export default ExportPreferredPharmacy;
