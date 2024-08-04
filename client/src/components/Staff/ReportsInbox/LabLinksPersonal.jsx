import { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useLabLinksPersonal } from "../../../hooks/reactquery/queries/labLinksQueries";
import useIntersection from "../../../hooks/useIntersection";
import Button from "../../UI/Buttons/Button";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LabLinkPersonalForm from "./LabLinkPersonalForm";
import LabLinkPersonalItem from "./LabLinkPersonalItem";

const LabLinksPersonal = () => {
  const { user } = useUserContext();
  const [search, setSearch] = useState("");
  const [errMsgPost, setErrMsgPost] = useState("");

  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useLabLinksPersonal(user.id, search);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
  };
  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );
  const [addVisible, setAddVisible] = useState(false);
  const handleAdd = () => {
    setAddVisible(true);
  };

  if (error)
    return (
      <div className="lablinks__personal">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  const links = data?.pages.flatMap((page) => page.items);

  return (
    <div className="lablinks__personal">
      <div className="lablinks__personal-title">
        <h3>Personal Links</h3>
        <Button onClick={handleAdd} disabled={addVisible} label="Add" />
      </div>
      <div className="lablinks__personal-search">
        <label htmlFor="search">Search</label>
        <input type="text" value={search} onChange={handleSearch} />
      </div>
      {error && <ErrorParagraph errorMsg={error.message} />}
      {errMsgPost && <p className="lablinks__form-err">{errMsgPost}</p>}
      {addVisible && (
        <LabLinkPersonalForm
          setAddVisible={setAddVisible}
          errMsgPost={errMsgPost}
          setErrMsgPost={setErrMsgPost}
        />
      )}
      <ul
        className="lablinks__personal-list"
        ref={rootRef}
        style={{ border: errMsgPost && "solid 1px red" }}
      >
        {links && links.length > 0
          ? links.map((link, index) =>
              index === links.length - 1 ? (
                <LabLinkPersonalItem
                  link={link}
                  key={link.id}
                  lastItemRef={lastItemRef}
                  errMsgPost={errMsgPost}
                  setErrMsgPost={setErrMsgPost}
                />
              ) : (
                <LabLinkPersonalItem
                  link={link}
                  key={link.id}
                  errMsgPost={errMsgPost}
                  setErrMsgPost={setErrMsgPost}
                />
              )
            )
          : !isFetchingNextPage &&
            !isPending && <EmptyLi text="No personal links" />}
        {(isFetchingNextPage || isPending) && <LoadingLi />}
      </ul>
    </div>
  );
};

export default LabLinksPersonal;
