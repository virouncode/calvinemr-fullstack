import useUserContext from "../../../hooks/context/useUserContext";
import {
  useLabLinks,
  useLabLinksCredentials,
} from "../../../hooks/reactquery/queries/labLinksQueries";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";
import LabLinkItem from "./LabLinkItem";
import LabLinksPersonal from "./LabLinksPersonal";

const LabLinks = () => {
  const { user } = useUserContext();
  const { data: labLinks, isPending, error } = useLabLinks();
  const {
    data: labLinksCredentials,
    isPending: isPendingCredentials,
    error: errorCredentials,
  } = useLabLinksCredentials(user.id);

  return (
    <div className="lablinks">
      {error && <p className="lablinks__err">{error.message}</p>}
      {errorCredentials && (
        <p className="lablinks__err">{errorCredentials.message}</p>
      )}
      <ul className="lablinks__list">
        {labLinks && labLinks.length > 0 ? (
          labLinks.map((item) => (
            <LabLinkItem
              key={item.id}
              link={item}
              credentials={
                labLinksCredentials?.find(
                  ({ lablink_id }) => lablink_id === item.id
                ) || null
              }
            />
          ))
        ) : (
          <EmptyLi text="No laboratory links" />
        )}
        {(isPending || isPendingCredentials) && <LoadingLi />}
      </ul>
      <LabLinksPersonal />
    </div>
  );
};

export default LabLinks;
