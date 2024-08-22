import React, { useEffect, useRef, useState } from "react";
import NewWindow from "react-new-window";
import { toast } from "react-toastify";
import useClinicContext from "../../../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import { useSites } from "../../../../../hooks/reactquery/queries/sitesQueries";
import { DemographicsType, SiteType } from "../../../../../types/api";
import { copyToClipboard } from "../../../../../utils/js/copyToClipboard";
import PrintButton from "../../../../UI/Buttons/PrintButton";
import SiteSelect from "../../../../UI/Lists/SiteSelect";
import EmptyParagraph from "../../../../UI/Paragraphs/EmptyParagraph";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";

type ClinicSiteLabelProps = {
  demographicsInfos: DemographicsType;
  windowRef: React.MutableRefObject<NewWindow | null>;
};

const ClinicSiteLabel = ({
  demographicsInfos,
  windowRef,
}: ClinicSiteLabelProps) => {
  const { clinic } = useClinicContext();
  const { staffInfos } = useStaffInfosContext();
  const [site, setSite] = useState<SiteType | undefined>();
  const assignedMd = staffInfos.find(
    ({ id }) => demographicsInfos.assigned_staff_id === id
  );
  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();

  const labelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sites || sites?.length === 0) return;
    setSite(sites.find(({ id }) => id === assignedMd?.site_id));
  }, [assignedMd?.site_id, sites]);

  const TITLE_STYLE = {
    fontSize: "1.1rem",
    fontWeight: "bold",
    textDecoration: "underline",
    padding: "0px 10px",
  };
  const LINE_STYLE = {
    fontSize: "0.8rem",
    padding: "0px 10px",
  };

  const handlePrint = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.nativeEvent.view?.print();
  };

  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setSite(sites?.find(({ id }) => id === value));
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

  return (
    <div className="labels-container">
      {sites && sites.length > 0 && site ? (
        <>
          <div className="labels-content__select">
            <SiteSelect
              handleSiteChange={handleSiteChange}
              sites={sites}
              value={site?.id}
            />
          </div>
          <div className="labels-content__label" ref={labelRef}>
            <p style={TITLE_STYLE}>{clinic?.name.toUpperCase()}</p>
            <p style={LINE_STYLE}>
              <span>SITE: {site.name}</span>
            </p>
            <p style={LINE_STYLE}>
              <span>
                ADDRESS: {site.address}, {site.city}, {site.province_state},{" "}
                {site.postal_code || site.zip_code}
              </span>
            </p>
            <p style={LINE_STYLE}>
              <span>PHONE: {site.phone}</span>
              <span> / </span>
              <span>FAX: {site.fax}</span>
            </p>
            <p style={LINE_STYLE}>
              <span>EMAIL: {site.email || clinic?.email}</span>
            </p>
            <p style={LINE_STYLE}>
              <span>WEBSITE: {clinic?.website}</span>
            </p>
          </div>
        </>
      ) : (
        <EmptyParagraph text="The clinic has no sites" />
      )}
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

export default ClinicSiteLabel;
