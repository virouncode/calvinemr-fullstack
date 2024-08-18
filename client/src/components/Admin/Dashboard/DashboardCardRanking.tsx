import React from "react";
import { SiteType } from "../../../types/api";
import { TopKFrequentType } from "../../../types/app";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import SiteSelect from "../../UI/Lists/SiteSelect";

type DashboardCardRankingProps = {
  title: string;
  handleSiteChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sites: SiteType[];
  siteSelectedId: number;
  top10Infos: TopKFrequentType[];
};

const DashboardCardRanking = ({
  title,
  handleSiteChange,
  sites,
  siteSelectedId,
  top10Infos,
}: DashboardCardRankingProps) => {
  return (
    <div className="dashboard-card__ranking">
      <p className="dashboard-card__ranking-title">{title}</p>
      <SiteSelect
        handleSiteChange={handleSiteChange}
        sites={sites}
        value={siteSelectedId}
        all={true}
        label="Site"
      />
      {top10Infos && top10Infos.length > 0 ? (
        <ul className="dashboard-card__ranking-content">
          {top10Infos.map((item, index: number) => (
            <li key={item.id} className="dashboard-card__ranking-item">
              <span
                className="dashboard-card__ranking-item-nbr"
                style={{ width: "20px" }}
              >
                {index + 1}:
              </span>{" "}
              <span>
                {title.includes("diagnoses")
                  ? item.diagnosis
                  : title.includes("billings")
                  ? item.billing_code
                  : item.medication}{" "}
                ({item.frequency})
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyParagraph text="Not enough datas" />
      )}
    </div>
  );
};

export default DashboardCardRanking;
