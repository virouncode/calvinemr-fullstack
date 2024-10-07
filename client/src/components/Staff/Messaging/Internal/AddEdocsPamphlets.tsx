import React, { useState } from "react";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useEdocs } from "../../../../hooks/reactquery/queries/edocsQueries";
import { usePamphlets } from "../../../../hooks/reactquery/queries/pamphletsQueries";
import useIntersection from "../../../../hooks/useIntersection";
import { EdocType, PamphletType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import Button from "../../../UI/Buttons/Button";
import CancelButton from "../../../UI/Buttons/CancelButton";
import Checkbox from "../../../UI/Checkbox/Checkbox";
import Input from "../../../UI/Inputs/Input";
import EmptyLi from "../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";

type AddEdocsPamphletsProps = {
  edocs: EdocType[];
  pamphlets: PamphletType[];
  setEdocs: React.Dispatch<React.SetStateAction<EdocType[]>>;
  setPamphlets: React.Dispatch<PamphletType[]>;
  setAddEdocsPamphletsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddEdocsPamphlets = ({
  edocs,
  pamphlets,
  setEdocs,
  setPamphlets,
  setAddEdocsPamphletsVisible,
}: AddEdocsPamphletsProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [searchEdocs, setSearchEdocs] = useState("");
  const [searchPamphlets, setSearchPamphlets] = useState("");
  const [checkedEdocs, setCheckedEdocs] = useState<EdocType[]>(edocs);
  const [checkedPamphlets, setCheckedPamphlets] =
    useState<PamphletType[]>(pamphlets);
  const {
    data: dataEdocs,
    isPending: isPendingEdocs,
    error: errorEdocs,
    isFetchingNextPage: isFetchingNextPageEdocs,
    fetchNextPage: fetchNextPageEdocs,
    isFetching: isFetchingEdocs,
  } = useEdocs(searchEdocs);

  //INTERSECTION OBSERVER
  const { divRef: divRefEdocs, lastItemRef: lastItemRefEdocs } =
    useIntersection(
      isFetchingNextPageEdocs,
      fetchNextPageEdocs,
      isFetchingEdocs
    );

  const {
    data: dataPamphlets,
    isPending: isPendingPamphlets,
    error: errorPamphlets,
    isFetchingNextPage: isFetchingNextPagePamphlets,
    fetchNextPage: fetchNextPagePamphlets,
    isFetching: isFetchingPamphlets,
  } = usePamphlets(searchPamphlets);

  //INTERSECTION OBSERVER
  const { divRef: divRefPamphlets, lastItemRef: lastItemRefPamphlets } =
    useIntersection(
      isFetchingNextPagePamphlets,
      fetchNextPagePamphlets,
      isFetchingPamphlets
    );

  const handleSearchEdocs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchEdocs(e.target.value);
  };

  const handleSearchPamphlets = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPamphlets(e.target.value);
  };

  const handleEdocCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    edoc: EdocType
  ) => {
    const checked = e.target.checked;
    if (checked) {
      setCheckedEdocs([...checkedEdocs, edoc]);
    } else {
      setCheckedEdocs(checkedEdocs.filter(({ id }) => id !== edoc.id));
    }
  };

  const handlePamphletCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    pamphlet: PamphletType
  ) => {
    const checked = e.target.checked;
    if (checked) {
      setCheckedPamphlets([...checkedPamphlets, pamphlet]);
    } else {
      setCheckedPamphlets(
        checkedPamphlets.filter(({ id }) => id !== pamphlet.id)
      );
    }
  };

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setEdocs(checkedEdocs);
    setPamphlets(checkedPamphlets);

    setAddEdocsPamphletsVisible(false);
  };
  const handleCancel = () => {
    setAddEdocsPamphletsVisible(false);
  };

  const edocsResults = dataEdocs?.pages.flatMap((page) => page.items);
  const pamphletsResults = dataPamphlets?.pages.flatMap((page) => page.items);

  return (
    <div className="add-edocs-pamphlets">
      <div className="add-edocs">
        <div className="add-edocs__title">Edocs</div>
        <div className="add-edocs__search">
          <Input
            value={searchEdocs}
            onChange={handleSearchEdocs}
            id="search-edocs"
            placeholder="Search by name..."
          />
        </div>
        <div className="add-edocs__results" ref={divRefEdocs}>
          {errorEdocs ? (
            <ErrorParagraph errorMsg={errorEdocs.message} />
          ) : (
            <ul>
              {(edocsResults?.length ?? 0) > 0 ? (
                edocsResults?.map((edoc, index) =>
                  index === edocsResults.length - 1 ? (
                    <li ref={lastItemRefEdocs} key={edoc.id}>
                      <Checkbox
                        label={edoc.name}
                        id={`${edoc.id}-edoc`}
                        onChange={(e) => handleEdocCheck(e, edoc)}
                        checked={checkedEdocs
                          .map(({ id }) => id)
                          .includes(edoc.id)}
                      />
                    </li>
                  ) : (
                    <li key={edoc.id}>
                      <Checkbox
                        label={edoc.name}
                        id={`${edoc.id}-edoc`}
                        onChange={(e) => handleEdocCheck(e, edoc)}
                        checked={checkedEdocs
                          .map(({ id }) => id)
                          .includes(edoc.id)}
                      />
                    </li>
                  )
                )
              ) : (
                <EmptyLi text="No corresponding edocs" />
              )}
              {isFetchingEdocs && <LoadingLi />}
            </ul>
          )}
        </div>
      </div>
      <div className="add-pamphlets">
        <div className="add-pamphlets__title">Pamphlets</div>
        <div className="add-pamphlets__search">
          <Input
            value={searchPamphlets}
            onChange={handleSearchPamphlets}
            id="search-pamphlets"
            placeholder="Search by name..."
          />
        </div>
        <div className="add-pamphlets__results" ref={divRefPamphlets}>
          {errorPamphlets ? (
            <ErrorParagraph errorMsg={errorPamphlets.message} />
          ) : (
            <ul>
              {(pamphletsResults?.length ?? 0) > 0 ? (
                pamphletsResults?.map((pamphlet, index) =>
                  index === pamphletsResults.length - 1 ? (
                    <li ref={lastItemRefPamphlets} key={pamphlet.id}>
                      <Checkbox
                        label={pamphlet.name}
                        id={`${pamphlet.id}-pamphlet`}
                        onChange={(e) => handlePamphletCheck(e, pamphlet)}
                        checked={checkedPamphlets
                          .map(({ id }) => id)
                          .includes(pamphlet.id)}
                      />
                    </li>
                  ) : (
                    <li key={pamphlet.id}>
                      <Checkbox
                        label={pamphlet.name}
                        id={`${pamphlet.id}-pamphlet`}
                        onChange={(e) => handlePamphletCheck(e, pamphlet)}
                        checked={checkedPamphlets
                          .map(({ id }) => id)
                          .includes(pamphlet.id)}
                      />
                    </li>
                  )
                )
              ) : (
                <EmptyLi text="No corresponding pamphlets" />
              )}
              {isFetchingPamphlets && <LoadingLi />}
            </ul>
          )}
        </div>
      </div>
      <div className="add-edocs-pamphlets__btn-container">
        <Button label="Confirm" onClick={handleAdd} className="save-btn" />
        <CancelButton onClick={handleCancel} />
      </div>
    </div>
  );
};

export default AddEdocsPamphlets;
