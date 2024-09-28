import React from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useLabLinks,
  useLabLinksCredentials,
} from "../../../hooks/reactquery/queries/labLinksQueries";
import { LabLinkCredentialsType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LabLinkItem from "./LabLinkItem";
import LabLinksPersonal from "./LabLinksPersonal";

const LabLinks = () => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { data: labLinks, isPending, error } = useLabLinks();
  //Queries
  const {
    data: labLinksCredentials,
    isPending: isPendingCredentials,
    error: errorCredentials,
  } = useLabLinksCredentials(user.id);

  return (
    <div className="lablinks">
      {error && <ErrorParagraph errorMsg={error.message} />}
      {errorCredentials && (
        <ErrorParagraph errorMsg={errorCredentials.message} />
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
                ) as LabLinkCredentialsType
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
