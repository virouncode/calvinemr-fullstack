import React, { useEffect, useState } from "react";
import { DemographicsType, PharmacyType } from "../../../../../types/api";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

type PharmaciesDropDownProps = {
  demographicsInfos: DemographicsType;
  loadingPatient: boolean;
  errPatient: Error | null;
};

const PharmaciesDropDown = ({
  demographicsInfos,
  loadingPatient,
  errPatient,
}: PharmaciesDropDownProps) => {
  const [preferredPharmacy, setPreferredPharmacy] = useState<
    PharmacyType | undefined
  >();

  useEffect(() => {
    setPreferredPharmacy(demographicsInfos.preferred_pharmacy);
  }, [demographicsInfos.preferred_pharmacy]);

  if (loadingPatient)
    return (
      <div className="topic-content">
        <CircularProgressMedium />
      </div>
    );

  if (errPatient)
    return (
      <div className="topic-content">
        <ErrorParagraph errorMsg={errPatient.message} />
      </div>
    );
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
