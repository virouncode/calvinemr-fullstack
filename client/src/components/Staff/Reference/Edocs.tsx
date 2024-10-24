import React, { useState } from "react";
import { useEdocs } from "../../../hooks/reactquery/queries/edocsQueries";
import useDebounce from "../../../hooks/useDebounce";
import useIntersection from "../../../hooks/useIntersection";
import Button from "../../UI/Buttons/Button";
import Input from "../../UI/Inputs/Input";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import EmptyRow from "../../UI/Tables/EmptyRow";
import LoadingRow from "../../UI/Tables/LoadingRow";
import FakeWindow from "../../UI/Windows/FakeWindow";
import EdocForm from "./EdocForm";
import EdocItem from "./EdocItem";

const Edocs = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(setSearch, 300);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [addVisible, setAddVisible] = useState(false);
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useEdocs(debouncedSearch);

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

  const edocs = data?.pages.flatMap((page) => page.items);

  return (
    <div className="reference__edocs">
      <div className="reference__edocs-title">
        <h3>E-docs</h3>
        <Button onClick={handleAdd} disabled={addVisible} label="Add" />
      </div>
      <div className="reference__edocs-search">
        <Input
          label="Search"
          value={search}
          onChange={handleSearch}
          id="search-edocs"
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
                {data && (edocs?.length ?? 0) > 0
                  ? edocs?.map((item, index) =>
                      index === edocs.length - 1 ? (
                        <EdocItem
                          item={item}
                          key={item.id}
                          lastItemRef={lastItemRef}
                        />
                      ) : (
                        <EdocItem item={item} key={item.id} />
                      )
                    )
                  : !isFetchingNextPage &&
                    !isPending && <EmptyRow colSpan={6} text="No edocs" />}
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
          title="ADD A NEW E-DOC"
          width={1024}
          height={550}
          x={(window.innerWidth - 1024) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#94bae8"
          setPopUpVisible={setAddVisible}
        >
          <EdocForm setAddVisible={setAddVisible} />
        </FakeWindow>
      )}
    </div>
  );
};

export default Edocs;
