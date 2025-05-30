import React, { useState } from "react";
import { usePamphlets } from "../../../hooks/reactquery/queries/pamphletsQueries";
import useDebounce from "../../../hooks/useDebounce";
import useIntersection from "../../../hooks/useIntersection";
import Button from "../../UI/Buttons/Button";
import Input from "../../UI/Inputs/Input";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import EmptyRow from "../../UI/Tables/EmptyRow";
import LoadingRow from "../../UI/Tables/LoadingRow";
import FakeWindow from "../../UI/Windows/FakeWindow";
import PamphletForm from "./PamphletForm";
import PamphletItem from "./PamphletItem";

const Pamphlets = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [addVisible, setAddVisible] = useState(false);
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = usePamphlets(debouncedSearch);

  //INTERSECTION OBSERVER
  const { divRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleAdd = () => {
    setAddVisible(true);
  };

  const pamphlets = data?.pages.flatMap((page) => page.items);

  return (
    <div className="reference__edocs">
      <div className="reference__edocs-title">
        <h3>Pamphlets</h3>
        <Button onClick={handleAdd} disabled={addVisible} label="Add" />
      </div>
      <div className="reference__edocs-search">
        <Input
          label="Search"
          value={search}
          onChange={handleSearch}
          id="search-edocs"
          width={300}
        />
      </div>
      <div className="reference__edocs-results">
        {error && <ErrorParagraph errorMsg={error.message} />}
        <>
          <div className="reference__edocs-table-container" ref={divRef}>
            <table className="reference__edocs-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Name</th>
                  <th>File</th>
                  <th>Notes</th>
                  <th>Created by</th>
                  <th>Created on</th>
                </tr>
              </thead>
              <tbody>
                {data && (pamphlets?.length ?? 0) > 0
                  ? pamphlets?.map((item, index) =>
                      index === pamphlets.length - 1 ? (
                        <PamphletItem
                          item={item}
                          key={item.id}
                          setErrMsgPost={setErrMsgPost}
                          errMsgPost={errMsgPost}
                          lastItemRef={lastItemRef}
                        />
                      ) : (
                        <PamphletItem
                          item={item}
                          key={item.id}
                          setErrMsgPost={setErrMsgPost}
                          errMsgPost={errMsgPost}
                        />
                      )
                    )
                  : !isFetchingNextPage &&
                    !isPending && <EmptyRow colSpan={6} text="No pamphlets" />}
                {(isPending || isFetchingNextPage) && (
                  <LoadingRow colSpan={6} />
                )}
              </tbody>
            </table>
          </div>
        </>
      </div>
      {addVisible && (
        <FakeWindow
          title="ADD A NEW PAMPHLET"
          width={1000}
          height={550}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#94bae8"
          setPopUpVisible={setAddVisible}
        >
          <PamphletForm
            setAddVisible={setAddVisible}
            setErrMsgPost={setErrMsgPost}
            errMsgPost={errMsgPost}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default Pamphlets;
