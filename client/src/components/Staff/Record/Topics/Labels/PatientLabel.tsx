import React, { useRef } from "react";
import { toast } from "react-toastify";
import useClinicContext from "../../../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import { useSites } from "../../../../../hooks/reactquery/queries/sitesQueries";
import { DemographicsType } from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import { copyToClipboard } from "../../../../../utils/js/copyToClipboard";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import PrintButton from "../../../../UI/Buttons/PrintButton";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";

type PatientLabelProps = {
  demographicsInfos: DemographicsType;
  windowRef: React.MutableRefObject<Window | null>;
};

const PatientLabel = ({ demographicsInfos, windowRef }: PatientLabelProps) => {
  const { staffInfos } = useStaffInfosContext();
  const { clinic } = useClinicContext();
  const assignedMd = staffInfos.find(
    ({ id }) => demographicsInfos.assigned_staff_id === id
  );
  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();

  const labelRef = useRef<HTMLDivElement | null>(null);

  const TITLE_STYLE = {
    fontSize: "1.1rem",
    fontWeight: "bold",
    textDecoration: "underline",
    padding: "0px 10px",
  };
  const LINE_STYLE = {
    fontSize: "0.7rem",
    padding: "0px 10px",
  };
  const SPAN_STYLE = {
    // marginRight: "10px",
  };
  const SMALL_LINE_STYLE = {
    fontSize: "0.5rem",
    padding: "0px 10px",
  };

  const handlePrint = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.nativeEvent.view?.print();
  };
  const handleCopy = async () => {
    try {
      if (!windowRef.current || !labelRef.current) return;
      await copyToClipboard(windowRef.current, labelRef.current);
      toast.success("Copied !", { containerId: "A" });
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Unable to copy label: ${err.message}`, {
          containerId: "A",
        });
    }
  };

  if (isPendingSites) return <LoadingParagraph />;
  if (errorSites) return <ErrorParagraph errorMsg={errorSites.message} />;

  const patientSite = sites.find(({ id }) => id === assignedMd?.site_id);

  return (
    <div className="labels-container">
      <div className="labels-content__label" ref={labelRef}>
        <p style={TITLE_STYLE}>
          {toPatientName(demographicsInfos).toUpperCase()}
        </p>
        <p style={LINE_STYLE}>
          <span style={SPAN_STYLE}>SEX: {demographicsInfos.Gender}</span>
          <span style={SPAN_STYLE}> / </span>
          <span style={SPAN_STYLE}>
            DOB: {timestampToDateISOTZ(demographicsInfos.DateOfBirth)}
          </span>
        </p>
        <p style={LINE_STYLE}>
          <span style={SPAN_STYLE}>
            HIN: {demographicsInfos.HealthCard?.Number}{" "}
            {demographicsInfos.HealthCard?.Version}
          </span>
          <span style={SPAN_STYLE}> / </span>
          <span style={SPAN_STYLE}>
            CHART#: {demographicsInfos.ChartNumber}
          </span>
        </p>
        <p style={LINE_STYLE}>
          <span style={SPAN_STYLE}>
            ADDRESS:{" "}
            {
              demographicsInfos.Address?.find(
                ({ _addressType }) => _addressType === "R"
              )?.Structured?.Line1
            }
            ,{" "}
            {
              demographicsInfos.Address?.find(
                ({ _addressType }) => _addressType === "R"
              )?.Structured?.City
            }
            ,{" "}
            {
              demographicsInfos.Address?.find(
                ({ _addressType }) => _addressType === "R"
              )?.Structured?.CountrySubDivisionCode
            }
            ,{" "}
            {demographicsInfos.Address?.find(
              ({ _addressType }) => _addressType === "R"
            )?.Structured?.PostalZipCode?.PostalCode ||
              demographicsInfos.Address?.find(
                ({ _addressType }) => _addressType === "R"
              )?.Structured?.PostalZipCode?.ZipCode ||
              ""}
          </span>
        </p>
        <p style={LINE_STYLE}>
          <span style={SPAN_STYLE}>
            PHONE:{" "}
            {demographicsInfos.PhoneNumber?.find(
              ({ _phoneNumberType }) => _phoneNumberType === "C"
            )?.phoneNumber ||
              demographicsInfos.PhoneNumber?.find(
                ({ _phoneNumberType }) => _phoneNumberType === "R"
              )?.phoneNumber ||
              demographicsInfos.PhoneNumber?.find(
                ({ _phoneNumberType }) => _phoneNumberType === "W"
              )?.phoneNumber ||
              ""}
          </span>
          <span style={SPAN_STYLE}> / </span>
          <span style={SPAN_STYLE}>EMAIL: {demographicsInfos.Email}</span>
        </p>
        <p style={LINE_STYLE}>
          <span style={SPAN_STYLE}>
            {staffIdToTitleAndName(
              staffInfos,
              demographicsInfos.assigned_staff_id,
              false
            )}
          </span>
        </p>
        <p style={SMALL_LINE_STYLE}>
          {assignedMd && patientSite && (
            <span style={SPAN_STYLE}>
              {clinic?.name}, {patientSite.name}, {patientSite.address},{" "}
              {patientSite.city}, {patientSite.province_state},{" "}
              {patientSite.postal_code || patientSite.zip_code}
            </span>
          )}
        </p>
        <p style={SMALL_LINE_STYLE}>
          <span style={SPAN_STYLE}>Email: {clinic?.email}</span>
          <span style={SPAN_STYLE}> / </span>
          <span style={SPAN_STYLE}>Website: {clinic?.website}</span>
          <span style={SPAN_STYLE}> / </span>
          <span style={SPAN_STYLE}>Tel: {patientSite?.phone}</span>
        </p>
      </div>
      <div>
        <PrintButton
          onClick={handlePrint}
          className="labels-content__print-btn"
        />
        <PrintButton
          onClick={handleCopy}
          className="labels-content__print-btn"
          label="Copy to clipboard"
        />
      </div>
    </div>
  );
};

export default PatientLabel;
