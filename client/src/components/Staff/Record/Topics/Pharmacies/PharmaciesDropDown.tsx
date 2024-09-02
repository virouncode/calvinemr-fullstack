import React, { useEffect, useState } from "react";
import { DemographicsType, PharmacyType } from "../../../../../types/api";

type PharmaciesDropDownProps = {
  demographicsInfos: DemographicsType;
};

const PharmaciesDropDown = ({ demographicsInfos }: PharmaciesDropDownProps) => {
  const [preferredPharmacy, setPreferredPharmacy] = useState<
    PharmacyType | undefined
  >();

  useEffect(() => {
    setPreferredPharmacy(demographicsInfos.preferred_pharmacy);
  }, [demographicsInfos.preferred_pharmacy]);

  return (
    <div className="topic-content">
      <label style={{ fontWeight: "bold" }}>Preferred Pharmacy: </label>
      {preferredPharmacy ? (
        <span>
          {preferredPharmacy.Name},{" "}
          {preferredPharmacy.Address?.Structured?.Line1},{" "}
          {preferredPharmacy.Address?.Structured?.City},{" "}
          {preferredPharmacy.Address?.Structured?.CountrySubDivisionCode},{" "}
          {preferredPharmacy.PhoneNumber?.[0]?.phoneNumber}
        </span>
      ) : (
        "No preferred pharmacy"
      )}
    </div>
  );
};

export default PharmaciesDropDown;
