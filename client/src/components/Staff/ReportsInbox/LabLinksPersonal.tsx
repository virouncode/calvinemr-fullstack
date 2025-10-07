import React, { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useLabLinksPersonal } from "../../../hooks/reactquery/queries/labLinksQueries";
import useIntersection from "../../../hooks/useIntersection";
import { UserStaffType } from "../../../types/app";
import Button from "../../UI/Buttons/Button";
import Input from "../../UI/Inputs/Input";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LabLinkPersonalForm from "./LabLinkPersonalForm";
import LabLinkPersonalItem from "./LabLinkPersonalItem";

const LabLinksPersonal = () => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [search, setSearch] = useState("");
  const [errMsgPost, setErrMsgPost] = useState("");
  //Queries
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useLabLinksPersonal(user.id, search);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };
  const { rootRef, targetRef } = useIntersection<HTMLUListElement | null>(
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
      {addVisible && (
        <LabLinkPersonalForm
          setAddVisible={setAddVisible}
          errMsgPost={errMsgPost}
          setErrMsgPost={setErrMsgPost}
        />
      )}
      <div className="lablinks__personal-search">
        <Input
          label="Search"
          value={search}
          onChange={handleSearch}
          placeholder="Name, URL,..."
        />
      </div>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}

      <ul
        className="lablinks__list"
        ref={rootRef}
        style={{ border: errMsgPost && "solid 1px red" }}
      >
        {links && links.length > 0
          ? links.map((link, index) =>
              index === links.length - 1 ? (
                <LabLinkPersonalItem
                  link={link}
                  key={link.id}
                  targetRef={targetRef}
                  setErrMsgPost={setErrMsgPost}
                />
              ) : (
                <LabLinkPersonalItem
                  link={link}
                  key={link.id}
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
