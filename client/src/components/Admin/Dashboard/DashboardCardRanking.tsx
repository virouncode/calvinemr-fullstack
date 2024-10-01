import React from "react";
import { SiteType } from "../../../types/api";
import { TopKFrequentType } from "../../../types/app";
import SiteSelect from "../../UI/Lists/SiteSelect";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";

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
      <div className="dashboard-card__ranking-site">
        <SiteSelect
          handleSiteChange={handleSiteChange}
          sites={sites}
          value={siteSelectedId}
          all={true}
          label="Site"
        />
      </div>

      {top10Infos && top10Infos.length > 0 ? (
        <ul className="dashboard-card__ranking-content">
          {top10Infos.map((item, index: number) => (
            <li key={item.id} className="dashboard-card__ranking-item">
              <div className="dashboard-card__ranking-item-nbr">
                {index + 1}:
              </div>{" "}
              <div className="dashboard-card__ranking-item-text">
                {title.includes("diagnoses")
                  ? item.diagnosis
                  : title.includes("billing")
                  ? item.billing_code
                  : item.medication}{" "}
                ({item.frequency})
              </div>
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
