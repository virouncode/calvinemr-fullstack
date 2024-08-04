import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../omdDatas/codesTables";
import { showDocument } from "../../../utils/files/showDocument";
import EditButton from "../../UI/Buttons/EditButton";
import SignCellMultipleTypes from "../../UI/Tables/SignCellMultipleTypes";

const SiteItem = ({ site, handleEditClick }) => {
  const handleClickLogo = () => {
    showDocument(site.logo?.url, site.logo?.mime);
  };

  return (
    <>
      <tr style={{ color: site.site_status === "Closed" && "red" }}>
        <td>
          <div className="site-item__btn-container">
            <EditButton onClick={(e) => handleEditClick(e, site.id)} />
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
