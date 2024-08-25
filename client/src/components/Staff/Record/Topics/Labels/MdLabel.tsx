import React, { useEffect, useRef, useState } from "react";
import NewWindow from "react-new-window";
import { toast } from "react-toastify";
import useClinicContext from "../../../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useSites } from "../../../../../hooks/reactquery/queries/sitesQueries";
import { SiteType, StaffType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { copyToClipboard } from "../../../../../utils/js/copyToClipboard";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import PrintButton from "../../../../UI/Buttons/PrintButton";
import SiteSelect from "../../../../UI/Lists/SiteSelect";
import EmptyParagraph from "../../../../UI/Paragraphs/EmptyParagraph";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";

type MdLabelProps = {
  windowRef: React.MutableRefObject<NewWindow | null>;
};

const MdLabel = ({ windowRef }: MdLabelProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const { clinic } = useClinicContext();
  const handlePrint = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.nativeEvent.view?.print();
  };
  const [site, setSite] = useState<SiteType | undefined>();
  const [mdId, setMdId] = useState(user.id);
  const [md, setMd] = useState<StaffType | undefined>(user);
  const labelRef = useRef<HTMLDivElement | null>(null);

  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();

  useEffect(() => {
    if (!sites || sites?.length === 0) return;
    setSite(sites.find(({ id }) => id === user.site_id));
  }, [sites, user.site_id]);

  const TITLE_STYLE = {
    fontSize: "1rem",
    fontWeight: "bold",
    textDecoration: "underline",
    padding: "0px 10px",
  };
  const LINE_STYLE = {
    fontSize: "0.7rem",
    padding: "0px 10px",
  };
  const SPAN_STYLE = {
    // marginRight: "20px",
  };
  const SELECT_STYLE = {
    fontFamily: "Arial, sans-serif",
    fontSize: "0.8rem",
  };

  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setSite(sites?.find(({ id }) => id === value));
  };
  const handleChangeMd = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setMdId(value);
    setMd(staffInfos.find(({ id }) => id === value));
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
          <div className="labels-content__select" style={SELECT_STYLE}>
            <label
              style={{
                fontWeight: "bold",
                fontSize: "0.8rem",
                marginRight: "10px",
              }}
              htmlFor="practitioner"
            >
              Practitioner{" "}
            </label>
            <select
              style={{
                marginRight: "10px",
              }}
              value={mdId}
              onChange={handleChangeMd}
              id="practitioner"
            >
              {staffInfos
                .filter(({ title }) => title === "Doctor")
                .map((staff) => (
                  <option value={staff.id} key={staff.id}>
                    {staffIdToTitleAndName(staffInfos, staff.id)}
                  </option>
                ))}
            </select>
            <SiteSelect
              handleSiteChange={handleSiteChange}
              sites={sites}
              value={site.id}
            />
          </div>
          <div className="labels-content__label" ref={labelRef}>
            <p style={TITLE_STYLE}>
              {staffIdToTitleAndName(staffInfos, md?.id, false).toUpperCase()}
            </p>
            <p style={LINE_STYLE}>
              <span style={SPAN_STYLE}>CPSO: {md?.licence_nbr}</span>
              <span style={SPAN_STYLE}> / </span>
              <span style={SPAN_STYLE}>OHIP: {md?.ohip_billing_nbr}</span>
            </p>
            <p style={LINE_STYLE}>CLINIC: {clinic?.name}</p>
            <p style={LINE_STYLE}>
              <span style={SPAN_STYLE}>SITE: {site.name}</span>
            </p>
            <p style={LINE_STYLE}>
              <span>
                ADDRESS: {site.address}, {site.city}, {site.province_state},{" "}
                {site.postal_code || site.zip_code}
              </span>
            </p>
            <p style={LINE_STYLE}>
              <span style={SPAN_STYLE}>PHONE: {site.phone}</span>
              <span style={SPAN_STYLE}> / </span>
              <span style={SPAN_STYLE}>FAX: {site.fax}</span>
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

export default MdLabel;
