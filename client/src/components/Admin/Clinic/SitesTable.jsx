import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import EmptyRow from "../../UI/Tables/EmptyRow";
import LoadingRow from "../../UI/Tables/LoadingRow";
import SiteItem from "./SiteItem";

const SitesTable = ({ sites, loading, errMsg, handleEditClick }) => {
  return (
    <>
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      {!errMsg && (
        <div className="sites__table-container">
          <table>
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
              {sites && sites.length > 0
                ? sites.map((site) => (
                    <SiteItem
                      key={site.id}
                      site={site}
                      handleEditClick={handleEditClick}
                    />
                  ))
                : !loading && <EmptyRow colSpan="12" text="No clinic sites" />}
              {loading && <LoadingRow colSpan="12" />}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default SitesTable;
