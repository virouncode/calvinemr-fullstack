import React from "react";
import { SiteType } from "../../../types/api";
import EmptyRow from "../../UI/Tables/EmptyRow";
import SiteItem from "./SiteItem";

type SitesTableProps = {
  sites: SiteType[];
  handleEditClick: (
    e: React.MouseEvent<HTMLButtonElement>,
    siteId: number
  ) => void;
};

const SitesTable = ({ sites, handleEditClick }: SitesTableProps) => {
  return (
    <>
      <div className="clinic__sites-table-container">
        <table className="clinic__sites-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Site name</th>
              <th>Address</th>
              <th>City</th>
              <th>Province/State</th>
              <th>Postal/Zip code</th>
              <th>Phone</th>
              <th>Fax</th>
              <th>Email</th>
              <th>Logo</th>
              <th>Rooms list</th>
              <th>Status</th>
              <th>Updated by</th>
              <th>Updated on</th>
            </tr>
          </thead>
          <tbody>
            {sites && sites.length > 0 ? (
              sites.map((site) => (
                <SiteItem
                  key={site.id}
                  site={site}
                  handleEditClick={handleEditClick}
                />
              ))
            ) : (
              <EmptyRow colSpan={12} text="No clinic sites" />
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SitesTable;
