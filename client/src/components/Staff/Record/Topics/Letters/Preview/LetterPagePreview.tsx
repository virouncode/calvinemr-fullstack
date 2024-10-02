import React from "react";
import { DemographicsType, SiteType } from "../../../../../../types/api";
import LetterDate from "../Form/LetterDate";
import LetterHeader from "../Form/LetterHeader";
import LetterPatientInfos from "../Form/LetterPatientInfos";
import LetterSign from "../Form/LetterSign";

type LetterPagePreviewProps = {
  sites: SiteType[];
  siteSelectedId: number;
  demographicsInfos: DemographicsType;
  dateStr: string;
  subject: string;
  recipientInfos: string;
  printRef: React.MutableRefObject<HTMLDivElement | null>;
  body: string;
  numberOfPages: number;
};

const LetterPagePreview = ({
  sites,
  siteSelectedId,
  demographicsInfos,
  dateStr,
  subject,
  recipientInfos,
  printRef,
  body,
  numberOfPages,
}: LetterPagePreviewProps) => {
  return (
    <>
      <div className="letter__page" ref={printRef}>
        <LetterHeader site={sites.find(({ id }) => id === siteSelectedId)} />
        <div className="letter__subheader">
          <div className="letter__recipient" style={{ position: "relative" }}>
            <label style={{ padding: 0 }}>Addressed to:</label>
            <div style={{ whiteSpace: "pre-wrap", display: "inline-block" }}>
              {recipientInfos}
            </div>
          </div>
          <div className="letter__subject">
            <label>Subject:</label>
            <div style={{ whiteSpace: "pre-wrap", display: "inline-block" }}>
              {subject}
            </div>
          </div>
          <LetterPatientInfos demographicsInfos={demographicsInfos} />
          <LetterDate dateStr={dateStr} />
        </div>
        <div className="letter__body">
          <div
            style={{
              width: "100%",
              height: "440px",
              fontSize: "$size-sm",
              whiteSpace: "pre-wrap",
              textAlign: "justify",
              padding: "5px 10px",
            }}
          >
            {body}
          </div>
        </div>
        <LetterSign />
        <div style={{ fontSize: "0.7rem", padding: "0 10px" }}>
          Page: 1/{numberOfPages}
        </div>
      </div>
    </>
  );
};

export default LetterPagePreview;
