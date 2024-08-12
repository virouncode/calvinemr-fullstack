import React from "react";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../omdDatas/codesTables";
import { SiteType } from "../../../types/api";
import { showDocument } from "../../../utils/files/showDocument";
import EditButton from "../../UI/Buttons/EditButton";
import SignCellMultipleTypes from "../../UI/Tables/SignCellMultipleTypes";

type SiteItemProps = {
  site: SiteType;
  handleEditClick: (e: React.MouseEvent<HTMLButtonElement>, id: number) => void;
};

const SiteItem = ({ site, handleEditClick }: SiteItemProps) => {
  const handleClickLogo = () => {
    showDocument(site.logo?.url ?? "", site.logo?.mime ?? "");
  };

  return (
    <>
      <tr style={{ color: site.site_status === "Closed" ? "red" : "" }}>
        <td>
          <div className="site-item__btn-container">
            <EditButton
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleEditClick(e, site.id as number)
              }
            />
          </div>
        </td>
        <td>{site.name || ""}</td>
        <td>{site.address || ""}</td>
        <td>{site.city || ""}</td>
        <td>
          {toCodeTableName(provinceStateTerritoryCT, site.province_state) || ""}
        </td>
        <td>{site.postal_code || site.zip_code || ""}</td>
        <td>{site.phone || ""}</td>
        <td>{site.fax || ""}</td>
        <td>{site.email || ""}</td>
        <td
          style={{
            cursor: "pointer",
            color: "blue",
            textDecoration: "underline",
          }}
          onClick={handleClickLogo}
        >
          {site.logo?.name || ""}
        </td>
        <td>
          {site.rooms
            .filter(({ id }) => id !== "z")
            .sort((a, b) => a.id.localeCompare(b.id))
            .map(({ title }) => title)
            .join(", ")}
        </td>
        <td>{site.site_status}</td>
        <SignCellMultipleTypes item={site} />
      </tr>
    </>
  );
};

export default SiteItem;
