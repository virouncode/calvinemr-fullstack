import xmlFormat from "xml-formatter";
import {
  AlertType,
  AllergyType,
  AppointmentType,
  CareElementType,
  ClinicalNoteType,
  DemographicsType,
  FamilyHistoryType,
  ImmunizationType,
  MedType,
  PastHealthType,
  PersonalHistoryType,
  PregnancyType,
  ProblemListType,
  RelationshipType,
  ReportType,
  RiskFactorType,
} from "../../../types/api";
import {
  timestampToDateISOTZ,
  timestampToDateTimeSecondsISOTZ,
} from "../../dates/formatDates";
import { toPatientName } from "../../names/toPatientName";
import { escapeXml } from "../../xml/escapeXml";

export const toXmlDemographics = (jsObj: DemographicsType) => {
  const xmlNames = `<Names>
<cdsd:NamePrefix>${escapeXml(jsObj.Names?.NamePrefix ?? "")}</cdsd:NamePrefix>
    <cdsd:LegalName namePurpose=${escapeXml(
      jsObj.Names?.LegalName?._namePurpose
    )}>
      <cdsd:FirstName>
        <cdsd:Part>${escapeXml(
          jsObj.Names?.LegalName?.FirstName?.Part ?? ""
        )}</cdsd:Part>
        <cdsd:PartType>${escapeXml(
          jsObj.Names?.LegalName?.FirstName?.PartType ?? ""
        )}</cdsd:PartType>
        <cdsd:PartQualifier>${escapeXml(
          jsObj.Names?.LegalName?.FirstName?.PartQualifier ?? ""
        )}</cdsd:PartQualifier>
      </cdsd:FirstName>
      <cdsd:LastName>
        <cdsd:Part>${escapeXml(
          jsObj.Names?.LegalName?.LastName?.Part ?? ""
        )}</cdsd:Part>
        <cdsd:PartType>${escapeXml(
          jsObj.Names?.LegalName?.LastName?.PartType ?? ""
        )}</cdsd:PartType>
        <cdsd:PartQualifier>${escapeXml(
          jsObj.Names?.LegalName?.LastName?.PartQualifier ?? ""
        )}</cdsd:PartQualifier>
      </cdsd:LastName>
      ${
        jsObj.Names?.LegalName?.OtherName?.length > 0
          ? jsObj.Names?.LegalName?.OtherName.map((otherName) =>
              otherName.Part
                ? `<cdsd:OtherName>
            <cdsd:Part>${escapeXml(otherName.Part ?? "")}</cdsd:Part>
            <cdsd:PartType>${escapeXml(
              otherName.PartType ?? ""
            )}</cdsd:PartType>
            <cdsd:PartQualifier>${escapeXml(
              otherName.PartQualifier ?? ""
            )}</cdsd:PartQualifier>
          </cdsd:OtherName>`
                : ""
            ).join("")
          : ""
      }
    </cdsd:LegalName>
    ${
      jsObj.Names?.OtherNames?.length > 0
        ? jsObj.Names?.OtherNames.map(
            (item) =>
              `<cdsd:OtherNames namePurpose=${escapeXml(item._namePurpose)}>
      ${
        item.OtherName?.length > 0
          ? item.OtherName.map((otherName) =>
              otherName.Part
                ? `<cdsd:OtherName>
      <cdsd:Part>${escapeXml(otherName.Part ?? "")}</cdsd:Part>
      <cdsd:PartType>${escapeXml(otherName.PartType ?? "")}</cdsd:PartType>
      <cdsd:PartQualifier>${escapeXml(
        otherName.PartQualifier ?? ""
      )}</cdsd:PartQualifier>
    </cdsd:OtherName>`
                : ""
            ).join("")
          : ""
      }
    </cdsd:OtherNames>`
          ).join("")
        : ""
    }
    <cdsd:LastNameSuffix>${escapeXml(
      jsObj.Names?.LastNameSuffix ?? ""
    )}</cdsd:LastNameSuffix>
  </Names>`;

  const xmlDob = `<DateOfBirth>${escapeXml(
    timestampToDateISOTZ(jsObj.DateOfBirth)
  )}</DateOfBirth>`;

  const xmlHealthCard = `
    <HealthCard>
      <cdsd:Number>${escapeXml(jsObj.HealthCard?.Number ?? "")}</cdsd:Number>
      <cdsd:Version>${escapeXml(jsObj.HealthCard?.Version ?? "")}</cdsd:Version>
      <cdsd:Expirydate>${escapeXml(
        timestampToDateISOTZ(jsObj.HealthCard.ExpiryDate)
      )}</cdsd:Expirydate>
      <cdsd:ProvinceCode>${escapeXml(
        jsObj.HealthCard?.ProvinceCode ?? ""
      )}</cdsd:ProvinceCode>
    </HealthCard>`;

  const xmlChartNumber = `<ChartNumber>${escapeXml(
    jsObj.ChartNumber ?? ""
  )}</ChartNumber>`;

  const xmlGender = `<Gender>${escapeXml(jsObj.Gender ?? "")}</Gender>`;

  const xmlUniqueVendorId = `<UniqueVendorIdSequence>${escapeXml(
    jsObj.patient_id.toString()
  )}</UniqueVendorIdSequence>`;

  const xmlAddress =
    jsObj.Address?.length > 0
      ? jsObj.Address.map(
          (address) =>
            `<Address addressType=${escapeXml(address._addressType)}>
    <cdsd:Structured>
        <cdsd:Line1>${escapeXml(address.Structured?.Line1 ?? "")}</cdsd:Line1>
        <cdsd:Line2>${escapeXml(address.Structured?.Line2 ?? "")}</cdsd:Line2>
        <cdsd:Line3>${escapeXml(address.Structured?.Line3 ?? "")}</cdsd:Line3>
        <cdsd:City>${escapeXml(address.Structured?.City ?? "")}</cdsd:City>
        <cdsd:CountrySubdivisionCode>${escapeXml(
          address.Structured?.CountrySubDivisionCode ?? ""
        )}</cdsd:CountrySubdivisionCode>
        <cdsd:PostalZipCode>
          ${
            address.Structured?.PostalZipCode?.PostalCode
              ? `<cdsd:PostalCode>${escapeXml(
                  address.Structured?.PostalZipCode?.PostalCode
                )}</cdsd:PostalCode>`
              : `<cdsd:ZipCode>${escapeXml(
                  address.Structured?.PostalZipCode?.ZipCode ?? ""
                )}</cdsd:ZipCode>`
          }
        </cdsd:PostalZipCode>
    </cdsd:Structured>
   </Address>`
        ).join("")
      : "";

  const xmlPhoneNumber =
    jsObj.PhoneNumber?.length > 0
      ? jsObj.PhoneNumber.map(
          (item) =>
            `<PhoneNumber phoneNumberType=${escapeXml(item._phoneNumberType)}>
        ${`<cdsd:phoneNumber>${escapeXml(item.phoneNumber)}</cdsd:phoneNumber>
                <cdsd:extension>${escapeXml(
                  item.extension ?? ""
                )}</cdsd:extension>`}
</PhoneNumber>`
        ).join("")
      : "";

  const xmlPreferredOfficialLang = `<PreferredOfficialLanguage>${escapeXml(
    jsObj.PreferredOfficialLanguage ?? ""
  )}</PreferredOfficialLanguage>`;

  const xmlPreferredSpokenLang = `<PreferredSpokenLanguage>${escapeXml(
    jsObj.PreferredSpokenLanguage ?? ""
  )}</PreferredSpokenLanguage>`;

  const xmlContact =
    jsObj.Contact?.length > 0
      ? jsObj.Contact.map(
          (contact) =>
            `<Contact>
        <ContactPurpose>
          ${
            contact.ContactPurpose?.PurposeAsEnum
              ? `<cdsd:PurposeAsEnum>${escapeXml(
                  contact.ContactPurpose?.PurposeAsEnum
                )}</cdsd:PurposeAsEnum>`
              : `<cdsd:PurposeAsPlainText>${escapeXml(
                  contact.ContactPurpose?.PurposeAsPlainText ?? ""
                )}</cdsd:PurposeAsPlainText>`
          }
        </ContactPurpose>
        <Name>
          <cdsd:FirstName>
          ${escapeXml(contact.Name?.FirstName ?? "")}
          </cdsd:FirstName>
          <cdsd:MiddleName>
          ${escapeXml(contact.Name?.MiddleName ?? "")}
          </cdsd:MiddleName>
          <cdsd:LastName>
          ${escapeXml(contact.Name?.LastName ?? "")}
          </cdsd:LastName>
        </Name>
        ${
          contact.PhoneNumber?.length > 0
            ? contact.PhoneNumber.map(
                (item) =>
                  `<PhoneNumber phoneNumberType=${item._phoneNumberType}>
                  ${
                    item.phoneNumber
                      ? `<cdsd:phoneNumber>${escapeXml(
                          item.phoneNumber
                        )}</cdsd:phoneNumber>
            <cdsd:extension>${escapeXml(item.extension ?? "")}</cdsd:extension>`
                      : `<cdsd:areaCode>${escapeXml(
                          item.areaCode ?? ""
                        )}</cdsd:areaCode><cdsd:number>${escapeXml(
                          item.number ?? ""
                        )}</cdsd:number><cdsd:extension>${escapeXml(
                          item.extension ?? ""
                        )}</cdsd:extension><cdsd:exchange>${escapeXml(
                          item.exchange ?? ""
                        )}</cdsd:exchange>`
                  }
          </PhoneNumber>`
              ).join("")
            : ""
        }
        <EmailAddress>${escapeXml(contact.EmailAddress ?? "")}</EmailAddress>
        <Note>${escapeXml(contact.Note ?? "")}</Note>
      </Contact>`
        ).join("")
      : "";

  const xmlNote = `<NoteAboutPatient>${escapeXml(
    jsObj.NoteAboutPatient ?? ""
  )}</NoteAboutPatient>`;

  const xmlEnrolment = `<Enrolment>
      ${
        jsObj.Enrolment?.EnrolmentHistory?.length > 0
          ? jsObj.Enrolment.EnrolmentHistory.map(
              (history) =>
                `<EnrolmentHistory>
            <EnrollmentStatus>${escapeXml(
              history.EnrollmentStatus ?? ""
            )}</EnrollmentStatus>
            <EnrollmentDate>${escapeXml(
              timestampToDateISOTZ(history.EnrollmentDate)
            )}</EnrollmentDate>
            <EnrollmentTerminationDate>${escapeXml(
              timestampToDateISOTZ(history.EnrollmentTerminationDate)
            )}</EnrollmentTerminationDate>
            <TerminationReason>${escapeXml(
              history.TerminationReason ?? ""
            )}</TerminationReason>
            <EnrolledToPhysician>
              <Name>
                <cdsd:FirstName>
                ${escapeXml(history.EnrolledToPhysician?.Name?.FirstName ?? "")}
                </cdsd:FirstName>
                <cdsd:LastName>
                ${escapeXml(history.EnrolledToPhysician?.Name?.LastName ?? "")}
                </cdsd:LastName>
              </Name>
              <OHIPPhysicianId>${escapeXml(
                history.EnrolledToPhysician?.OHIPPhysicianId ?? ""
              )}</OHIPPhysicianId>
            </EnrolledToPhysician>
        </EnrolmentHistory>`
            ).join("")
          : ""
      }
      </Enrolment>`;

  const xmlPrimaryPh = `<PrimaryPhysician>
        <Name>
          <cdsd:FirstName>
          ${escapeXml(jsObj.PrimaryPhysician?.Name?.FirstName ?? "")}
          </cdsd:FirstName>
          <cdsd:LastName>
          ${escapeXml(jsObj.PrimaryPhysician?.Name?.LastName ?? "")}
          </cdsd:LastName>
        </Name>
        <OHIPPhysicianId>
          ${escapeXml(jsObj.PrimaryPhysician?.OHIPPhysicianId ?? "")}
        </OHIPPhysicianId>
        <PrimaryPhysicianCPSO>
          ${escapeXml(jsObj.PrimaryPhysician?.PrimaryPhysicianCPSO ?? "")}
        </PrimaryPhysicianCPSO>
      </PrimaryPhysician>`;

  const xmlEmail = `<Email>${escapeXml(jsObj.Email ?? "")}</Email>`;

  const xmlPersonStatusCode = `<PersonStatusCode>
  ${
    jsObj.PersonStatusCode?.PersonStatusAsEnum
      ? `<PersonStatusAsEnum>${escapeXml(
          jsObj.PersonStatusCode?.PersonStatusAsEnum
        )}</PersonStatusAsEnum>`
      : `<PersonStatusAsPlainText>${escapeXml(
          jsObj.PersonStatusCode?.PersonStatusAsPlainText ?? ""
        )}</PersonStatusAsPlainText>`
  }
  </PersonStatusCode>`;

  const xmlPersonStatusDate = `<PersonStatusDate>${escapeXml(
    timestampToDateISOTZ(jsObj.PersonStatusDate)
  )}</PersonStatusDate>`;

  const xmlSIN = `<SIN>${escapeXml(jsObj.SIN ?? "")}</SIN>`;

  const xmlReferredPh = `<ReferredPhysician>
      <cdsd:FirstName>
      ${escapeXml(jsObj.ReferredPhysician?.FirstName ?? "")}
      </cdsd:FirstName>
      <cdsd:LastName>
      ${escapeXml(jsObj.ReferredPhysician?.LastName ?? "")}
      </cdsd:LastName>
    </ReferredPhysician>`;

  const xmlFamilyPh = `<FamilyPhysician>
      <cdsd:FirstName>
      ${escapeXml(jsObj.FamilyPhysician?.FirstName ?? "")}
      </cdsd:FirstName>
      <cdsd:LastName>
      ${escapeXml(jsObj.FamilyPhysician?.LastName ?? "")}
      </cdsd:LastName>
    </FamilyPhysician>`;

  const xmlpreferred_pharmacy = jsObj.preferred_pharmacy
    ? `<preferred_pharmacy>
    <Name>${escapeXml(jsObj.preferred_pharmacy?.Name ?? "")}</Name>
    <Address addressType=${escapeXml(
      jsObj.preferred_pharmacy?.Address?._addressType
    )}>
      <cdsd:Structured>
        <cdsd:Line1>${escapeXml(
          jsObj.preferred_pharmacy?.Address?.Structured?.Line1 ?? ""
        )}</cdsd:Line1>
        <cdsd:Line2>${escapeXml(
          jsObj.preferred_pharmacy?.Address?.Structured?.Line2 ?? ""
        )}</cdsd:Line2>
        <cdsd:Line3>${escapeXml(
          jsObj.preferred_pharmacy?.Address?.Structured?.Line3 ?? ""
        )}</cdsd:Line3>
        <cdsd:City>${escapeXml(
          jsObj.preferred_pharmacy?.Address?.Structured?.City ?? ""
        )}</cdsd:City>
        <cdsd:CountrySubdivisionCode>${escapeXml(
          jsObj.preferred_pharmacy?.Address?.Structured
            ?.CountrySubDivisionCode ?? ""
        )}</cdsd:CountrySubdivisionCode>
        <cdsd:PostalZipCode>
          ${
            jsObj.preferred_pharmacy?.Address?.Structured?.PostalZipCode
              ?.PostalCode
              ? `<cdsd:PostalCode>${escapeXml(
                  jsObj.preferred_pharmacy?.Address?.Structured?.PostalZipCode
                    ?.PostalCode
                )}</cdsd:PostalCode>`
              : `
          <cdsd:ZipCode>${escapeXml(
            jsObj.preferred_pharmacy?.Address?.Structured?.PostalZipCode
              ?.ZipCode ?? ""
          )}</cdsd:ZipCode>`
          }
        </cdsd:PostalZipCode>
      </cdsd:Structured>
    </Address>
    ${
      jsObj.preferred_pharmacy?.PhoneNumber?.length > 0
        ? jsObj.preferred_pharmacy.PhoneNumber.map(
            (item) =>
              `<PhoneNumber phoneNumberType=${escapeXml(item._phoneNumberType)}>
            ${`<cdsd:phoneNumber>${escapeXml(
              item.phoneNumber
            )}</cdsd:phoneNumber>
                  <cdsd:extension>${escapeXml(
                    item.extension ?? ""
                  )}</cdsd:extension>`}
    </PhoneNumber>`
          ).join("")
        : ""
    }
    <FaxNumber phoneNumberType=${escapeXml(
      jsObj.preferred_pharmacy?.FaxNumber?._phoneNumberType
    )}>
       ${`<cdsd:phoneNumber>${escapeXml(
         jsObj.preferred_pharmacy?.FaxNumber?.phoneNumber
       )}</cdsd:phoneNumber>
        <cdsd:extension>${escapeXml(
          jsObj.preferred_pharmacy?.FaxNumber?.extension ?? ""
        )}</cdsd:extension>`}
    </FaxNumber>
    <EmailAddress>${escapeXml(
      jsObj.preferred_pharmacy?.EmailAddress ?? ""
    )}</EmailAddress>
  </preferred_pharmacy>`
    : "";

  const xmlDemographics =
    "<Demographics>" +
    xmlNames +
    xmlDob +
    xmlHealthCard +
    xmlChartNumber +
    xmlGender +
    xmlUniqueVendorId +
    xmlAddress +
    xmlPhoneNumber +
    xmlPreferredOfficialLang +
    xmlPreferredSpokenLang +
    xmlContact +
    xmlNote +
    xmlEnrolment +
    xmlPrimaryPh +
    xmlEmail +
    xmlPersonStatusCode +
    xmlPersonStatusDate +
    xmlSIN +
    xmlReferredPh +
    xmlFamilyPh +
    xmlpreferred_pharmacy +
    "</Demographics>";

  return xmlFormat(xmlDemographics, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlPersonalHistory = (jsObj: PersonalHistoryType) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${escapeXml(dataElement.Name ?? "")}</cdsd:Name>
  <cdsd:DataType>${escapeXml(dataElement.DataType ?? "")}</cdsd:DataType>
  <cdsd:Content>${escapeXml(
    dataElement.Content ?? ""
  )}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;

  const xmlPersonalHistory =
    "<PersonalHistory>" + xmlResidual + "</PersonalHistory>";

  return xmlFormat(xmlPersonalHistory, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlFamHistory = (jsObj: FamilyHistoryType) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${escapeXml(dataElement.Name ?? "")}</cdsd:Name>
  <cdsd:DataType>${escapeXml(dataElement.DataType ?? "")}</cdsd:DataType>
  <cdsd:Content>${escapeXml(
    dataElement.Content ?? ""
  )}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;

  const xmlStartDate = `<StartDate><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.StartDate)
  )}</cdsd:FullDate></StartDate>`;

  const xmlAge = `<AgeAtOnset>${escapeXml(
    jsObj.AgeAtOnset ?? ""
  )}</AgeAtOnset>`;

  const xmlLifeStage = `<LifeStage>${escapeXml(
    jsObj.LifeStage ?? ""
  )}</LifeStage>`;

  const xmlProblemeDiagProcDesc = `<ProblemDiagnosisProcedureDescription>${escapeXml(
    jsObj.ProblemDiagnosisProcedureDescription ?? ""
  )}</ProblemDiagnosisProcedureDescription>`;

  const xmlDiagProcCode = `<DiagnosisProcedureCode>
  <cdsd:StandardCodingSystem>${escapeXml(
    jsObj.DiagnosisProcedureCode.StandardCodingSystem ?? ""
  )}</cdsd:StandardCodingSystem>
  <cdsd:StandardCode>${escapeXml(
    jsObj.DiagnosisProcedureCode.StandardCode ?? ""
  )}</cdsd:StandardCode>
  <cdsd:StandardCodeDescription>${escapeXml(
    jsObj.DiagnosisProcedureCode.StandardCodeDescription ?? ""
  )}</cdsd:StandardCodeDescription>
  </DiagnosisProcedureCode>`;

  const xmlTreatment = `<Treatment>${escapeXml(
    jsObj.Treatment ?? ""
  )}</Treatment>`;
  const xmlRelationship = `<Relationship>${escapeXml(
    jsObj.Relationship ?? ""
  )}</Relationship>`;
  const xmlNotes = `<Notes>${escapeXml(jsObj.Notes ?? "")}</Notes>`;

  const xmlFamHistory =
    "<FamilyHistory>" +
    xmlResidual +
    xmlStartDate +
    xmlAge +
    xmlLifeStage +
    xmlProblemeDiagProcDesc +
    xmlDiagProcCode +
    xmlTreatment +
    xmlRelationship +
    xmlNotes +
    "</FamilyHistory>";

  return xmlFormat(xmlFamHistory, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlPastHealth = (jsObj: PastHealthType) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${escapeXml(dataElement.Name ?? "")}</cdsd:Name>
  <cdsd:DataType>${escapeXml(dataElement.DataType ?? "")}</cdsd:DataType>
  <cdsd:Content>${escapeXml(
    dataElement.Content ?? ""
  )}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;

  const xmlPastHealthProbDescOrProc = `<PastHealthProblemDescriptionOrProcedures>${escapeXml(
    jsObj.PastHealthProblemDescriptionOrProcedures ?? ""
  )}</PastHealthProblemDescriptionOrProcedures>`;

  const xmlDiagProcCode = `<DiagnosisProcedureCode>
  <cdsd:StandardCodingSystem>${escapeXml(
    jsObj.DiagnosisProcedureCode?.StandardCodingSystem ?? ""
  )}</cdsd:StandardCodingSystem>
  <cdsd:StandardCode>${escapeXml(
    jsObj.DiagnosisProcedureCode?.StandardCode ?? ""
  )}</cdsd:StandardCode>
  <cdsd:StandardCodeDescription>${escapeXml(
    jsObj.DiagnosisProcedureCode?.StandardCodeDescription ?? ""
  )}</cdsd:StandardCodeDescription>
  </DiagnosisProcedureCode>`;

  const xmlOnsetOrEventDate = `<OnsetOrEventDate><cdsd:FullDate>${timestampToDateISOTZ(
    jsObj.OnsetOrEventDate
  )}</cdsd:FullDate></OnsetOrEventDate>`;

  const xmlLifeStage = `<LifeStage>${escapeXml(
    jsObj.LifeStage ?? ""
  )}</LifeStage>`;

  const xmlResolvedDate = `<ResolvedDate><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.ResolvedDate)
  )}</cdsd:FullDate></ResolvedDate>`;

  const xmlProcedureDate = `<ProcedureDate><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.ProcedureDate)
  )}</cdsd:FullDate></ProcedureDate>`;

  const xmlNotes = `<Notes>${escapeXml(jsObj.Notes ?? "")}</Notes>`;

  const xmlProblemStatus = `<ProblemStatus>${escapeXml(
    jsObj.ProblemStatus ?? ""
  )}</ProblemStatus>`;

  const xmlPastHealth =
    "<PastHealth>" +
    xmlResidual +
    xmlPastHealthProbDescOrProc +
    xmlDiagProcCode +
    xmlOnsetOrEventDate +
    xmlLifeStage +
    xmlResolvedDate +
    xmlProcedureDate +
    xmlNotes +
    xmlProblemStatus +
    "</PastHealth>";

  return xmlFormat(xmlPastHealth, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlProblemList = (jsObj: ProblemListType) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${escapeXml(dataElement.Name ?? "")}</cdsd:Name>
  <cdsd:DataType>${escapeXml(dataElement.DataType ?? "")}</cdsd:DataType>
  <cdsd:Content>${escapeXml(
    dataElement.Content ?? ""
  )}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;

  const xmlProblemDiagDesc = `<ProblemDiagnosisDescription>${escapeXml(
    jsObj.ProblemDiagnosisDescription ?? ""
  )}</ProblemDiagnosisDescription>`;

  const xmlDiagCode = `<DiagnosisCode>
  <cdsd:StandardCodingSystem>${escapeXml(
    jsObj.DiagnosisCode?.StandardCodingSystem ?? ""
  )}</cdsd:StandardCodingSystem>
  <cdsd:StandardCode>${escapeXml(
    jsObj.DiagnosisCode?.StandardCode ?? ""
  )}</cdsd:StandardCode>
  <cdsd:StandardCodeDescription>${escapeXml(
    jsObj.DiagnosisCode?.StandardCodeDescription ?? ""
  )}</cdsd:StandardCodeDescription>
  </DiagnosisCode>`;

  const xmlProblemDesc = `<ProblemDescription>${escapeXml(
    jsObj.ProblemDescription ?? ""
  )}</ProblemDescription>`;

  const xmlProblemStatus = `<ProblemStatus>${escapeXml(
    jsObj.ProblemStatus ?? ""
  )}</ProblemStatus>`;

  const xmlOnsetDate = `<OnsetDate><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.OnsetDate)
  )}</cdsd:FullDate></OnsetDate>`;

  const xmlLifeStage = `<LifeStage>${escapeXml(
    jsObj.LifeStage ?? ""
  )}</LifeStage>`;

  const xmlResolutionDate = `<ResolutionDate><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.ResolutionDate)
  )}</cdsd:FullDate></ResolutionDate>`;

  const xmlNotes = `<Notes>${escapeXml(jsObj.Notes ?? "")}</Notes>`;

  const xmlProblemList =
    "<ProblemList>" +
    xmlResidual +
    xmlProblemDiagDesc +
    xmlDiagCode +
    xmlProblemDesc +
    xmlProblemStatus +
    xmlOnsetDate +
    xmlLifeStage +
    xmlResolutionDate +
    xmlNotes +
    "</ProblemList>";

  return xmlFormat(xmlProblemList, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlRiskFactors = (jsObj: RiskFactorType) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${escapeXml(dataElement.Name ?? "")}</cdsd:Name>
  <cdsd:DataType>${escapeXml(dataElement.DataType ?? "")}</cdsd:DataType>
  <cdsd:Content>${escapeXml(
    dataElement.Content ?? ""
  )}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;

  const xmlRisk = `<RiskFactor>${escapeXml(
    jsObj.RiskFactor ?? ""
  )}</RiskFactor>`;

  const xmlExposure = `<ExposureDetails>${escapeXml(
    jsObj.ExposureDetails ?? ""
  )}</ExposureDetails>`;

  const xmlAgeOfOnset = `<AgeOfOnset>${escapeXml(
    jsObj.AgeOfOnset ?? ""
  )}</AgeOfOnset>`;

  const xmlStart = `<StartDate><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.StartDate)
  )}</cdsd:FullDate></StartDate>`;

  const xmlEnd = `<EndDate><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.EndDate)
  )}</cdsd:FullDate></EndDate>`;

  const xmlLifeStage = `<LifeStage>${escapeXml(
    jsObj.LifeStage ?? ""
  )}</LifeStage>`;

  const xmlNotes = `<Notes>${escapeXml(jsObj.Notes ?? "")}</Notes>`;

  const xmlRiskFactors =
    "<RiskFactors>" +
    xmlResidual +
    xmlRisk +
    xmlExposure +
    xmlAgeOfOnset +
    xmlStart +
    xmlEnd +
    xmlLifeStage +
    xmlNotes +
    "</RiskFactors>";

  return xmlFormat(xmlRiskFactors, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlAllergies = (jsObj: AllergyType) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${escapeXml(dataElement.Name ?? "")}</cdsd:Name>
  <cdsd:DataType>${escapeXml(dataElement.DataType ?? "")}</cdsd:DataType>
  <cdsd:Content>${escapeXml(
    dataElement.Content ?? ""
  )}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;

  const xmlOffendingAgentDesc = `<OffendingAgentDescription>${escapeXml(
    jsObj.OffendingAgentDescription ?? ""
  )}</OffendingAgentDescription>`;

  const xmlPropertyOfOffendingAgent = `<PropertyOfOffendingAgent>${escapeXml(
    jsObj.PropertyOfOffendingAgent ?? ""
  )}</PropertyOfOffendingAgent>`;

  const xmlCode = `<Code>
  <cdsd:CodeType>${escapeXml(jsObj.Code?.CodeType ?? "")}</cdsd:CodeType>
  <cdsd:CodeValue>${escapeXml(jsObj.Code?.CodeValue ?? "")}</cdsd:CodeValue>
  </Code>`;

  const xmlReactionType = `<ReactionType>${escapeXml(
    jsObj.ReactionType ?? ""
  )}</ReactionType>`;

  const xmlStart = `<StartDate><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.StartDate)
  )}</cdsd:FullDate></StartDate>`;

  const xmlLifeStage = `<LifeStage>${escapeXml(
    jsObj.LifeStage ?? ""
  )}</LifeStage>`;

  const xmlSeverity = `<Severity>${escapeXml(jsObj.Severity ?? "")}</Severity>`;

  const xmlReaction = `<Reaction>${escapeXml(jsObj.Reaction ?? "")}</Reaction>`;

  const xmlRecordedDate = `<RecordedDate><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.RecordedDate)
  )}</cdsd:FullDate></RecordedDate>`;

  const xmlNotes = `<Notes>${escapeXml(jsObj.Notes ?? "")}</Notes>`;

  const xmlAllergies =
    "<AllergiesAndAdverseReactions>" +
    xmlResidual +
    xmlOffendingAgentDesc +
    xmlPropertyOfOffendingAgent +
    xmlCode +
    xmlReactionType +
    xmlStart +
    xmlLifeStage +
    xmlSeverity +
    xmlReaction +
    xmlRecordedDate +
    xmlNotes +
    "</AllergiesAndAdverseReactions>";

  return xmlFormat(xmlAllergies, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlMedications = (jsObj: MedType) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${escapeXml(dataElement.Name ?? "")}</cdsd:Name>
  <cdsd:DataType>${escapeXml(dataElement.DataType ?? "")}</cdsd:DataType>
  <cdsd:Content>${escapeXml(
    dataElement.Content ?? ""
  )}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;
  const xmlPrescriptionDate = `<PrescriptionWrittenDate><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.PrescriptionWrittenDate)
  )}</cdsd:FullDate></PrescriptionWrittenDate>`;
  const xmlStart = `<StartDate><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.StartDate)
  )}</cdsd:FullDate></StartDate>`;
  const xmlDrugNumber = `<DrugIdentificationNumber>${escapeXml(
    jsObj.DrugIdentificationNumber ?? ""
  )}</DrugIdentificationNumber>`;
  const xmlDrugName = `<DrugName>${escapeXml(jsObj.DrugName ?? "")}</DrugName>`;
  const xmlStrength = `
  <Strength>
    <cdsd:Amount>${escapeXml(jsObj.Strength?.Amount ?? "")}
    </cdsd:Amount>
    <cdsd:UnitOfMeasure>${escapeXml(jsObj.Strength?.UnitOfMeasure ?? "")}
    </cdsd:UniteOfMeasure>
  </Strength>`;
  const xmlNumberOfRefills = `<NumberOfRefills>${escapeXml(
    jsObj.NumberOfRefills ?? ""
  )}</NumberOfRefills>`;
  const xmlDosage = `<Dosage>${escapeXml(jsObj.Dosage ?? "")}</Dosage>`;
  const xmlDosageUnitOfMeasure = `<DosageUnitOfMeasure>${escapeXml(
    jsObj.DosageUnitOfMeasure ?? ""
  )}</DosageUnitOfMeasure>`;
  const xmlForm = `<Form>${escapeXml(jsObj.Form ?? "")}</Form>`;
  const xmlRoute = `<Route>${escapeXml(jsObj.Route ?? "")}</Route>`;
  const xmlFrequency = `<Frequency>${escapeXml(
    jsObj.Frequency ?? ""
  )}</Frequency>`;
  const xmlDuration = `<Duration>${escapeXml(jsObj.Duration ?? "")}</Duration>`;
  const xmlRefillDuration = `<RefillDuration>${escapeXml(
    jsObj.RefillDuration ?? ""
  )}</RefillDuration>`;
  const xmlQuantity = `<Quantity>${escapeXml(jsObj.Quantity ?? "")}</Quantity>`;
  const xmlRefillQuantity = `<RefillQuantity>${escapeXml(
    jsObj.RefillQuantity ?? ""
  )}</RefillQuantity>`;
  const xmlLongTermMed = `<LongTermMedication>
    <cdsd:ynIndicatorsimple>${escapeXml(
      jsObj.LongTermMedication?.ynIndicatorsimple ?? ""
    )}</cdsd:ynIndicatorsimple>
  </LongTermMedication>`;
  const xmlPastMed = `<PastMedications>
    <cdsd:ynIndicatorsimple>${escapeXml(
      jsObj.PastMedication?.ynIndicatorsimple ?? ""
    )}</cdsd:ynIndicatorsimple>
  </PastMedications>`;
  const xmlPrescribedBy = `
  <PrescribedBy>
      <Name>
        <cdsd:FirstName>${escapeXml(
          jsObj.PrescribedBy?.Name.FirstName ?? ""
        )}</cdsd:FirstName>
        <cdsd:LastName>${escapeXml(
          jsObj.PrescribedBy?.Name.LastName ?? ""
        )}</cdsd:LastName>
      </Name>
      <OHIPPhysicianId>${escapeXml(
        jsObj.PrescribedBy?.OHIPPhysicianId ?? ""
      )}</OHIPPhysicianId>
  </PrescribedBy>`;
  const xmlNotes = `<Notes>${escapeXml(jsObj.Notes ?? "")}</Notes>`;
  const xmlPrescriptionInst = `<PrescriptionInstructions>${escapeXml(
    jsObj.PrescriptionInstructions ?? ""
  )}</PrescriptionInstructions>`;
  const xmlPatientCompliance = `<PatientCompliance>
    <cdsd:ynIndicatorsimple>${escapeXml(
      jsObj.PatientCompliance?.ynIndicatorsimple ?? ""
    )}</cdsd:ynIndicatorsimple>
  </PatientCompliance>`;
  const xmlTreatmentType = `<TreatmentType>${escapeXml(
    jsObj.TreatmentType ?? ""
  )}</TreatmentType>`;
  const xmlPrescriptionStatus = `<PrescriptionStatus>${escapeXml(
    jsObj.PrescriptionStatus ?? ""
  )}</PrescriptionStatus>`;
  const xmlNonAuthoritativeIndicator = `<NonAuthoritativeIndicator>${escapeXml(
    jsObj.NonAuthoritativeIndicator ?? ""
  )}</NonAuthoritativeIndicator>`;
  const xmlPrescriptionIdentifier = `<PrescriptionIdentifier>${escapeXml(
    jsObj.PrescriptionIdentifier ?? ""
  )}</PrescriptionIdentifier>`;
  const xmlPriorPrescriptionRefIdentifier = `<PriorPrescriptionReferenceIdentifier>${escapeXml(
    jsObj.PriorPrescriptionReferenceIdentifier ?? ""
  )}</PriorPrescriptionReferenceIdentifier>`;
  const xmlDispenseInterval = `<DispenseInterval>${escapeXml(
    jsObj.DispenseInterval ?? ""
  )}</DispenseInterval>`;
  const xmlDrugDescription = `<DrugDescription>${escapeXml(
    jsObj.DrugDescription ?? ""
  )}</DrugDescription>`;
  const xmlSubstitutionNotAllowed = `<SubstitutionNotAllowed>${escapeXml(
    jsObj.SubstitutionNotAllowed ?? ""
  )}</SubstitutionNotAllowed>`;
  const xmlProblemCode = `<ProblemCode>${escapeXml(
    jsObj.ProblemCode ?? ""
  )}</ProblemCode>`;
  const xmlProtocolIdentifier = `<ProtocolIdentifier>${escapeXml(
    jsObj.ProtocolIdentifier ?? ""
  )}</ProtocolIdentifier>`;

  const xmlMedications =
    "<MedicationsAndTreatments>" +
    xmlResidual +
    xmlPrescriptionDate +
    xmlStart +
    xmlDrugNumber +
    xmlDrugName +
    xmlStrength +
    xmlNumberOfRefills +
    xmlDosage +
    xmlDosageUnitOfMeasure +
    xmlForm +
    xmlRoute +
    xmlFrequency +
    xmlDuration +
    xmlRefillDuration +
    xmlQuantity +
    xmlRefillQuantity +
    xmlLongTermMed +
    xmlPastMed +
    xmlPrescribedBy +
    xmlNotes +
    xmlPrescriptionInst +
    xmlPatientCompliance +
    xmlTreatmentType +
    xmlPrescriptionStatus +
    xmlNonAuthoritativeIndicator +
    xmlPrescriptionIdentifier +
    xmlPriorPrescriptionRefIdentifier +
    xmlDispenseInterval +
    xmlDrugDescription +
    xmlSubstitutionNotAllowed +
    xmlProblemCode +
    xmlProtocolIdentifier +
    "</MedicationsAndTreatments>";

  return xmlFormat(xmlMedications, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlImmunizations = (jsObj: ImmunizationType) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${escapeXml(dataElement.Name ?? "")}</cdsd:Name>
  <cdsd:DataType>${escapeXml(dataElement.DataType ?? "")}</cdsd:DataType>
  <cdsd:Content>${escapeXml(
    dataElement.Content ?? ""
  )}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;

  const xmlImmunizationName = `<ImmunizationName>${escapeXml(
    jsObj.ImmunizationName ?? ""
  )}</ImmunizationName>`;
  const xmlImmunizationType = `<ImmunizationType>${escapeXml(
    jsObj.ImmunizationType.split("(")[0].trim() ?? ""
  )}</ImmunizationType>`;
  const xmlManufacturer = `<Manufacturer>${escapeXml(
    jsObj.Manufacturer ?? ""
  )}</Manufacturer>`;
  const xmlLotNumber = `<LotNumber>${escapeXml(
    jsObj.LotNumber ?? ""
  )}</LotNumber>`;
  const xmlRoute = `<Route>${escapeXml(jsObj.Route ?? "")}</Route>`;
  const xmlSite = `<Site>${escapeXml(jsObj.Site ?? "")}</Site>`;
  const xmlDose = `<Dose>${escapeXml(jsObj.Dose ?? "")}</Dose>`;
  const xmlImmunizationCode = `<ImmunizationCode><cdsd:CodingSystem>${escapeXml(
    jsObj.ImmunizationCode?.CodingSystem ?? ""
  )}</cdsd:CodingSystem><cdsd:value>${escapeXml(
    jsObj.ImmunizationCode?.value ?? ""
  )}</cdsd:value><cdsd:Description>${escapeXml(
    jsObj.ImmunizationCode?.Description ?? ""
  )}</cdsd:Description></ImmunizationCode>`;
  const xmlDate = `<Date><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.Date)
  )}</cdsd:FullDate>
  </Date>`;
  const xmlRefused = `<RefusedFlag>
    <cdsd:ynIndicatorsimple>${escapeXml(
      jsObj.RefusedFlag?.ynIndicatorsimple ?? ""
    )}</cdsd:ynIndicatorsimple>
  </RefusedFlag>`;
  const xmlInstructions = `<Instructions>${escapeXml(
    jsObj.Instructions ?? ""
  )}</Instructions>`;
  const xmlNotes = `<Notes>${escapeXml(jsObj.Notes ?? "")}</Notes>`;

  const xmlImmunizations =
    "<Immunizations>" +
    xmlResidual +
    xmlImmunizationName +
    xmlImmunizationType +
    xmlManufacturer +
    xmlLotNumber +
    xmlRoute +
    xmlSite +
    xmlDose +
    xmlImmunizationCode +
    xmlDate +
    xmlRefused +
    xmlInstructions +
    xmlNotes +
    "</Immunizations>";

  return xmlFormat(xmlImmunizations, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlLabResults = () => {
  return "";
};

export const toXmlAppointments = (jsObj: AppointmentType) => {
  const xmlTime = `<AppointmentTime>${escapeXml(
    jsObj.AppointmentTime ?? ""
  )}</AppointmentTime>`;
  const xmlDuration = `<Duration>${escapeXml(
    jsObj.Duration.toString() ?? ""
  )}</Duration>`;
  const xmlStatus = `<AppointmentStatus>${escapeXml(
    jsObj.AppointmentStatus ?? ""
  )}</AppointmentStatus>`;
  const xmlDate = `<AppointmentDate><cdsd:FullDate>${escapeXml(
    jsObj.AppointmentDate
  )}</cdsd:FullDate></AppointmentDate>`;
  const xmlProvider = `<Provider>
  <Name>
    <cdsd:FirstName>${escapeXml(
      jsObj.Provider?.Name.FirstName ?? ""
    )}</cdsd:FirstName>
    <cdsd:LastName>${escapeXml(
      jsObj.Provider?.Name.LastName ?? ""
    )}</cdsd:LastName>
  </Name>
  <OHIPPhysicianId>${escapeXml(
    jsObj.Provider?.OHIPPhysicianId ?? ""
  )}</OHIPPhysicianId>
  </Provider>`;
  const xmlPurpose = `<AppointmentPurpose>${escapeXml(
    jsObj.AppointmentPurpose ?? ""
  )}</AppointmentPurpose>`;
  const xmlNotes = `<AppointmentNotes>${escapeXml(
    jsObj.AppointmentNotes ?? ""
  )}</AppointmentNotes>`;

  const xmlAppointments =
    "<Appointments>" +
    xmlTime +
    xmlDuration +
    xmlStatus +
    xmlDate +
    xmlProvider +
    xmlPurpose +
    xmlNotes +
    "</Appointments>";

  return xmlFormat(xmlAppointments, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlClinicalNotes = (jsObj: ClinicalNoteType) => {
  const xmlNoteType = `<NoteType>${escapeXml(jsObj.NoteType ?? "")}</NoteType>`;
  const xmlContent = `<MyClinicalNotesContent>${escapeXml(
    jsObj.MyClinicalNotesContent ?? ""
  )}</MyClinicalNotesContent>`;
  const xmlEventDateTime = `<EventDateTime><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.EventDateTime)
  )}</cdsd:FullDate></EventDateTime>`;
  const xmlParticipatingProviders =
    jsObj.ParticipatingProviders?.length > 0
      ? jsObj.ParticipatingProviders.map(
          (provider) =>
            `<ParticipatingProviders>
      <Name>
        <cdsd:FirstName>${escapeXml(
          provider.Name?.FirstName ?? ""
        )}</cdsd:FirstName>
        <cdsd:LastName>${escapeXml(
          provider.Name?.LastName ?? ""
        )}</cdsd:LastName>
      </Name>
      <OHIPPhysicianId>
      ${escapeXml(provider.OHIPPhysicianId ?? "")}
      </OHIPPhysicianId>
      <DateTimeNoteCreated>
        <cdsd:FullDateTime>${
          provider.DateTimeNoteCreated
            ? escapeXml(
                timestampToDateTimeSecondsISOTZ(provider.DateTimeNoteCreated)
              )
            : ""
        }
        </cdsd:FullDateTime>
      </DateTimeNoteCreated>
    </ParticipatingProviders>`
        ).join("")
      : "";
  const xmlReviewer =
    jsObj.NoteReviewer?.length > 0
      ? jsObj.NoteReviewer.map(
          (provider) =>
            `<NoteReviewer>
  <Name>
    <cdsd:FirstName>${escapeXml(
      provider.Name?.FirstName ?? ""
    )}</cdsd:FirstName>
    <cdsd:LastName>${escapeXml(provider.Name?.LastName ?? "")}</cdsd:LastName>
  </Name>
  <OHIPPhysicianId>
  ${escapeXml(provider.OHIPPhysicianId ?? "")}
  </OHIPPhysicianId>
  <DateTimeNoteReviewed>
    <cdsd:FullDateTime>${
      provider.DateTimeNoteReviewed
        ? escapeXml(
            timestampToDateTimeSecondsISOTZ(provider.DateTimeNoteReviewed)
          )
        : ""
    }
    </cdsd:FullDateTime>
  </DateTimeNoteReviewed>
</NoteReviewer>`
        ).join("")
      : "";

  const xmlClinicalNotes =
    "<ClinicalNotes>" +
    xmlNoteType +
    xmlContent +
    xmlEventDateTime +
    xmlParticipatingProviders +
    xmlReviewer +
    "</ClinicalNotes>";

  return xmlFormat(xmlClinicalNotes, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlReports = (jsObj: ReportType) => {
  const xmlMedia = `<Media>${escapeXml(jsObj.Media ?? "")}</Media>`;
  const xmlForm = `<Format>${escapeXml(jsObj.Format ?? "")}</Format>`;
  const xmlFileExtAndVer = `<FileExtensionAndVersion>${escapeXml(
    jsObj.FileExtensionAndVersion ?? ""
  )}</FileExtensionAndVersion>`;
  const xmlFilePath = jsObj.File
    ? `<FilePath>./Reports_files/${escapeXml(jsObj.File.name)}
    </FilePath>`
    : "";
  const xmlContent = `<Content>
  ${
    jsObj.Content.Media
      ? `<cdsd:Media>${escapeXml(jsObj.Content.Media)}</cdsd:Media>`
      : `<cdsd:TextContent>${escapeXml(
          jsObj.Content?.TextContent ?? ""
        )}</cdsd:TextContent>`
  }
  </Content>`;
  const xmlClass = `<Class>${escapeXml(jsObj.Class ?? "")}</Class>`;
  const xmlSubClass = `<SubClass>${escapeXml(jsObj.SubClass ?? "")}</SubClass>`;
  const xmlEventDateTime = `<EventDateTime><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.EventDateTime)
  )}</cdsd:FullDate></EventDateTime>`;
  const xmlReceivedDateTime = `<ReceivedDateTime><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.ReceivedDateTime)
  )}</cdsd:FullDate></ReceivedDateTime>`;
  const xmlSourceAuthor = `<SourceAuthorPhysician>
  ${
    jsObj.SourceAuthorPhysician?.AuthorFreeText
      ? `<AuthorFreeText>
   ${escapeXml(jsObj.SourceAuthorPhysician?.AuthorFreeText)}
  </AuthorFreeText>`
      : `<AuthorName>
  <cdsd:FirstName>${escapeXml(
    jsObj.SourceAuthorPhysician?.AuthorName?.FirstName ?? ""
  )}</cdsd:FirstName>
  <cdsd:LastName>${escapeXml(
    jsObj.SourceAuthorPhysician?.AuthorName?.LastName ?? ""
  )}</cdsd:LastName>
  </AuthorName>`
  }
  </SourceAuthorPhysician>`;
  const xmlSourceFacility = `<SourceFacility>${escapeXml(
    jsObj.SourceFacility ?? ""
  )}</SourceFacility>`;
  const xmlReportReviewed =
    jsObj.ReportReviewed?.length > 0
      ? jsObj.ReportReviewed.map(
          (item) =>
            `<ReportReviewed>
      <Name>
        <cdsd:FirstName>
        ${escapeXml(item.Name?.FirstName ?? "")}
        </cdsd:FirstName>
        <cdsd:LastName>
        ${escapeXml(item.Name?.LastName ?? "")}
        </cdsd:LastName>
      </Name>
      <ReviewingOHIPPhysicianId>
        ${escapeXml(item.ReviewingOHIPPhysicianId ?? "")}
      </ReviewingOHIPPhysicianId>
      <DateTimeReportReviewed>
        <cdsd:FullDate>
          ${
            item.DateTimeReportReviewed
              ? escapeXml(timestampToDateISOTZ(item.DateTimeReportReviewed))
              : ""
          }
        </cdsd:FullDate>
      </DateTimeReportReviewed>
    </ReportReviewed>`
        ).join("")
      : "";
  const xmlFacilityId = `<SendingFacilityId>
  ${escapeXml(jsObj.SendingFacilityId ?? "")}</SendingFacilityId>`;
  const xmlFacilityReport = `<SendingFacilityReport>
  ${escapeXml(jsObj.SendingFacilityReport ?? "")}</SendingFacilityReport>`;

  const xmlOBR =
    jsObj.OBRContent?.length > 0
      ? jsObj.OBRContent.map(
          (obr) =>
            `<OBRContent>
   <AccompanyingSubClass>
   ${escapeXml(obr.AccompanyingSubClass ?? "")}
   </AccompanyingSubClass>
   <AccompanyingMnemonic>
   ${escapeXml(obr.AccompanyingMnemonic ?? "")}
   </AccompanyingMnemonic>
   <AccompanyingDescription>
   ${escapeXml(obr.AccompanyingDescription ?? "")}
   </AccompanyingDescription>
   <ObservationDateTime>
        <cdsd:FullDateTime>
        ${
          obr.ObservationDateTime
            ? escapeXml(
                timestampToDateTimeSecondsISOTZ(obr.ObservationDateTime)
              )
            : ""
        }
        </cdsd:FullDateTime>
   </ObservationDateTime>
  </OBRContent>`
        ).join("")
      : "";

  const xmlHRM = `<HRMResultStatus>${escapeXml(
    jsObj.HRMResultStatus ?? ""
  )}</HRMResultStatus>`;

  const xmlMessageId = `<MessageUniqueID>${escapeXml(
    jsObj.MessageUniqueID ?? ""
  )}</MessageUniqueID>`;

  const xmlNotes = `<Notes>${escapeXml(jsObj.Notes ?? "")}</Notes>`;

  const xmlRecipientName = `<RecipientName>
  <cdsd:FirstName>
  ${escapeXml(jsObj.RecipientName?.FirstName ?? "")}
  </cdsd:FirstName>
  <cdsd:LastName>
  ${escapeXml(jsObj.RecipientName?.LastName ?? "")}
  </cdsd:LastName>
  </RecipientName>`;

  const xmlSentDateTime = `<SentDateTime>
  <cdsd:FullDateTime>
  ${
    jsObj.DateTimeSent
      ? escapeXml(timestampToDateTimeSecondsISOTZ(jsObj.DateTimeSent))
      : ""
  }
  </cdsd:FullDateTime>
</SentDateTime>`;

  const xmlReports =
    "<Reports>" +
    xmlMedia +
    xmlForm +
    xmlFileExtAndVer +
    xmlFilePath +
    xmlContent +
    xmlClass +
    xmlSubClass +
    xmlEventDateTime +
    xmlReceivedDateTime +
    xmlSourceAuthor +
    xmlSourceFacility +
    xmlReportReviewed +
    xmlFacilityId +
    xmlFacilityReport +
    xmlOBR +
    xmlHRM +
    xmlMessageId +
    xmlNotes +
    xmlRecipientName +
    xmlSentDateTime +
    "</Reports>";

  return xmlFormat(xmlReports, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlCareElements = (jsObj: CareElementType) => {
  const xmlSmokingStatus =
    jsObj.SmokingStatus?.length > 0
      ? jsObj.SmokingStatus.map(
          (status) => `<SmokingStatus>
<cdsd:Status>
  ${escapeXml(status.Status ?? "")}
</cdsd:Status>
<cdsd:Date>
  ${escapeXml(timestampToDateISOTZ(status.Date))}
</cdsd:Date>
</SmokingStatus>`
        ).join("")
      : "";

  const xmlSmokingPacks =
    jsObj.SmokingPacks?.length > 0
      ? jsObj.SmokingPacks.map(
          (packs) =>
            `<SmokingPacks>
  <cdsd:PerDay>${escapeXml(packs.PerDay ?? "")}</cdsd:PerDay>
  <cdsd:Date>${escapeXml(timestampToDateISOTZ(packs.Date))}</cdsd:Date>
  </SmockingPacks>`
        ).join("")
      : "";

  const xmlWeight =
    jsObj.Weight?.length > 0
      ? jsObj.Weight.map(
          (weight) =>
            `<Weight>
      <cdsd:Weight>${escapeXml(weight.Weight ?? "")}</cdsd:Weight>
      <cdsd:WeightUnit>${escapeXml(weight.WeightUnit ?? "")}</cdsd:WeightUnit>
      <cdsd:Date>${escapeXml(timestampToDateISOTZ(weight.Date))}</cdsd:Date>
    </Weight>`
        ).join("")
      : "";

  const xmlHeight =
    jsObj.Height?.length > 0
      ? jsObj.Height.map(
          (height) =>
            `<Height>
        <cdsd:Height>${escapeXml(height.Height ?? "")}</cdsd:Height>
        <cdsd:HeightUnit>${escapeXml(height.HeightUnit ?? "")}</cdsd:HeightUnit>
        <cdsd:Date>${escapeXml(timestampToDateISOTZ(height.Date))}</cdsd:Date>
      </Height>`
        ).join("")
      : "";

  const xmlWaistCircumference =
    jsObj.WaistCircumference?.length > 0
      ? jsObj.WaistCircumference.map(
          (waist) =>
            `<WaistCircumference>
          <cdsd:WaistCircumference>${escapeXml(
            waist.WaistCircumference ?? ""
          )}</cdsd:WaistCircumference>
          <cdsd:WaistCircumferenceUnit>${escapeXml(
            waist.WaistCircumferenceUnit ?? ""
          )}</cdsd:WaistCircumferenceUnit>
          <cdsd:Date>${escapeXml(timestampToDateISOTZ(waist.Date))}</cdsd:Date>
        </WaistCircumference>`
        ).join("")
      : "";

  const xmlBloodPressure =
    jsObj.BloodPressure?.length > 0
      ? jsObj.BloodPressure.map(
          (bp) => `<BloodPressure>
  <cdsd:SystolicBP>${escapeXml(bp.SystolicBP ?? "")}</cdsd:SystolicBP>
  <cdsd:DiastolicBP>${escapeXml(bp.DiastolicBP ?? "")}</cdsd:DiastolicBP>
  <cdsd:BPUnit>${escapeXml(bp.BPUnit ?? "")}</cdsd:BPUnit>
  <cdsd:Date>${escapeXml(timestampToDateISOTZ(bp.Date))}</cdsd:Date>
  </BloodPressure>`
        ).join("")
      : "";

  const xmlDiabetesComplication =
    jsObj.DiabetesComplicationsScreening?.length > 0
      ? jsObj.DiabetesComplicationsScreening.map(
          (item) =>
            `<DiabetesComplicationsScreening>
      <cdsd:ExamCode>${escapeXml(item.ExamCode ?? "")}</cdsd:ExamCode>
      <cdsd:Date>${escapeXml(timestampToDateISOTZ(item.Date))}</cdsd:Date>
    </DiabetesComplicationsScreening>`
        ).join("")
      : "";

  const xmlDiabetesMotivation =
    jsObj.DiabetesMotivationalCounselling?.length > 0
      ? jsObj.DiabetesMotivationalCounselling.map(
          (item) =>
            `<DiabetesMotivationalCounselling>
      <cdsd:CounsellingPerformed>${escapeXml(
        item.CounsellingPerformed ?? ""
      )}</cdsd:CounsellingPerformed>
      <cdsd:Date>${escapeXml(timestampToDateISOTZ(item.Date))}</cdsd:Date>
    </DiabetesMotivationalCounselling>`
        ).join("")
      : "";

  const xmlDiabetesSelfMgmtCollab =
    jsObj.DiabetesSelfManagementCollaborative?.length > 0
      ? jsObj.DiabetesSelfManagementCollaborative.map(
          (item) =>
            `<DiabetesSelfManagementCollaborative>
      <cdsd:CodeValue>${escapeXml(item.CodeValue ?? "")}</cdsd:CodeValue>
      <cdsd:DocumentedGoals>${escapeXml(
        item.DocumentedGoals ?? ""
      )}</cdsd:DocumentedGoals>
      <cdsd:Date>${escapeXml(timestampToDateISOTZ(item.Date))}</cdsd:Date>
    </DiabetesSelfManagementCollaborative>`
        ).join("")
      : "";

  const xmlDiabetesSelfMgmtChallenges =
    jsObj.DiabetesSelfManagementChallenges?.length > 0
      ? jsObj.DiabetesSelfManagementChallenges.map(
          (item) =>
            `<DiabetesSelfManagementChallenges>
      <cdsd:CodeValue>${escapeXml(item.CodeValue ?? "")}</cdsd:CodeValue>
      <cdsd:ChallengesIdentified>${escapeXml(
        item.ChallengesIdentified ?? ""
      )}</cdsd:ChallengesIdentified>
      <cdsd:Date>${escapeXml(timestampToDateISOTZ(item.Date))}</cdsd:Date>
    </DiabetesSelfManagementChallenges>`
        ).join("")
      : "";

  const xmlDiabetesEducSelfManagement =
    jsObj.DiabetesEducationalSelfManagement?.length > 0
      ? jsObj.DiabetesEducationalSelfManagement.map(
          (item) =>
            `<DiabetesEducationalSelfManagement>
      <cdsd:EducationalTrainingPerformed>${escapeXml(
        item.EducationalTrainingPerformed ?? ""
      )}</cdsd:EducationalTrainingPerformed>
      <cdsd:Date>${escapeXml(timestampToDateISOTZ(item.Date))}</cdsd:Date>
    </DiabetesEducationalSelfManagement>`
        ).join("")
      : "";

  const xmlHypoEpisodes =
    jsObj.HypoglycemicEpisodes?.length > 0
      ? jsObj.HypoglycemicEpisodes.map(
          (item) =>
            `<HypoglycemicEpisodes>
  <cdsd:NumOfReportedEpisodes>${escapeXml(
    item.NumOfReportedEpisodes.toString() ?? ""
  )}</cdsd:NumOfReportedEpisodes>
  <cdsd:Date>${escapeXml(timestampToDateISOTZ(item.Date))}</cdsd:Date>
</HypoglycemicEpisodes>`
        ).join("")
      : "";

  const xmlSelfMonitoring =
    jsObj.SelfMonitoringBloodGlucose?.length > 0
      ? jsObj.SelfMonitoringBloodGlucose.map(
          (item) =>
            `<SelfMonitoringBloodGlucose>
  <cdsd:SelfMonitoring>${escapeXml(
    item.SelfMonitoring ?? ""
  )}</cdsd:SelfMonitoring>
  <cdsd:Date>${escapeXml(timestampToDateISOTZ(item.Date))}</cdsd:Date>
</SelfMonitoringBloodGlucose>`
        ).join("")
      : "";

  const xmlCareElements =
    "<CareElements>" +
    xmlSmokingStatus +
    xmlSmokingPacks +
    xmlWeight +
    xmlHeight +
    xmlWaistCircumference +
    xmlBloodPressure +
    xmlDiabetesComplication +
    xmlDiabetesMotivation +
    xmlDiabetesSelfMgmtCollab +
    xmlDiabetesSelfMgmtChallenges +
    xmlDiabetesEducSelfManagement +
    xmlHypoEpisodes +
    xmlSelfMonitoring +
    "</CareElements>";

  return xmlFormat(xmlCareElements, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlAlerts = (jsObj: AlertType) => {
  const xmlResidual = `<ResidualInfo>
  ${
    jsObj.ResidualInfo?.DataElement?.length > 0
      ? jsObj.ResidualInfo.DataElement.map(
          (dataElement) => `<cdsd:DataElement>
  <cdsd:Name>${escapeXml(dataElement.Name ?? "")}</cdsd:Name>
  <cdsd:DataType>${escapeXml(dataElement.DataType ?? "")}</cdsd:DataType>
  <cdsd:Content>${escapeXml(
    dataElement.Content ?? ""
  )}</cdsd:Content></cdsd:DataElement>`
        ).join("")
      : ""
  }
  </ResidualInfo>`;

  const xmlDescription = `<AlertDescription>${escapeXml(
    jsObj.AlertDescription ?? ""
  )}</AlertDescription>`;

  const xmlNotes = `<Notes>${escapeXml(jsObj.Notes ?? "")}</Notes>`;

  const xmlDateActive = `<DateActive><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.DateActive)
  )}</cdsd:FullDate></DateActive>`;

  const xmlEndDate = `<EndDate><cdsd:FullDate>${escapeXml(
    timestampToDateISOTZ(jsObj.EndDate)
  )}</cdsd:FullDate></EndDate>`;

  const xmlAlerts =
    "<AlertsAndSpecialNeeds>" +
    xmlResidual +
    xmlDescription +
    xmlNotes +
    xmlDateActive +
    xmlEndDate +
    "</AlertsAndSpecialNeeds>";

  return xmlFormat(xmlAlerts, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlPregnancies = (jsObj: PregnancyType) => {
  const xmlPregnancies = `<NewCategory>
<CategoryName>Pregnancies</CategoryName>
<CategoryDescription>Encompasses data collected from the patient's pregnancy events</CategoryDescription>
 <ResidualInfo>
${
  jsObj.description
    ? `<cdsd:DataElement>
<cdsd:Name>Description</cdsd:Name>
<cdsd:DataType>text</cdsd:DataType>
<cdsd:Content>${escapeXml(jsObj.description ?? "")}</cdsd:Content>
</cdsd:DataElement>`
    : ""
}
${
  jsObj.date_of_event
    ? `<cdsd:DataElement>
<cdsd:Name>EventDate</cdsd:Name>
<cdsd:DataType>date</cdsd:DataType>
<cdsd:Content>${escapeXml(
        timestampToDateISOTZ(jsObj.date_of_event)
      )}</cdsd:Content>
</cdsd:DataElement>`
    : ""
}
${
  jsObj.premises
    ? `<cdsd:DataElement>
<cdsd:Name>Premises</cdsd:Name>
<cdsd:DataType>text</cdsd:DataType>
<cdsd:Content>${escapeXml(jsObj.premises)}</cdsd:Content>
</cdsd:DataElement>`
    : ""
}
${
  jsObj.term_nbr_of_weeks
    ? `<cdsd:DataElement>
<cdsd:Name>TermNumberOfWeeks</cdsd:Name>
<cdsd:DataType>number</cdsd:DataType>
<cdsd:Content>${escapeXml(
        jsObj.term_nbr_of_weeks.toString() ?? ""
      )}</cdsd:Content>
</cdsd:DataElement>`
    : ""
}
${
  jsObj.term_nbr_of_days
    ? `<cdsd:DataElement><cdsd:Name>TermNumberOfDays</cdsd:Name><cdsd:DataType>number</cdsd:DataType><cdsd:Content>${escapeXml(
        jsObj.term_nbr_of_days.toString()
      )}</cdsd:Content></cdsd:DataElement>`
    : ""
}
</ResidualInfo>
</NewCategory>`;

  return xmlFormat(xmlPregnancies, {
    collapseContent: true,
    indentation: "  ",
  });
};

export const toXmlRelationships = (
  jsObj: RelationshipType,
  patientInfos: DemographicsType
) => {
  const xmlRelationships = `<NewCategory>
  <CategoryName>Relationships</CategoryName>
  <CategoryDescription>Contains data about the patient’s relationships</CategoryDescription>
   <ResidualInfo>
   ${
     jsObj.relationship
       ? `<cdsd:DataElement>
      <cdsd:Name>RelationType</cdsd:Name>
      <cdsd:DataType>text</cdsd:DataType>
      <cdsd:Content>${escapeXml(jsObj.relationship)} of</cdsd:Content>
    </cdsd:DataElement>`
       : ""
   }
    ${
      jsObj.relation_id
        ? `<cdsd:DataElement>
      <cdsd:Name>RelationName</cdsd:Name>
      <cdsd:DataType>text</cdsd:DataType>
      <cdsd:Content>${escapeXml(toPatientName(patientInfos))}</cdsd:Content>
    </cdsd:DataElement>`
        : ""
    }
  </ResidualInfo>
  </NewCategory>`;

  return xmlFormat(xmlRelationships, {
    collapseContent: true,
    indentation: "  ",
  });
};
