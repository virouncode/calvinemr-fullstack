import { useState } from "react";
import { useEdocs } from "../../../hooks/reactquery/queries/edocsQueries";
import useIntersection from "../../../hooks/useIntersection";
import EmptyRow from "../../UI/Tables/EmptyRow";
import LoadingRow from "../../UI/Tables/LoadingRow";
import FakeWindow from "../../UI/Windows/FakeWindow";
import EdocForm from "./EdocForm";
import ReferenceEdocItem from "./ReferenceEdocItem";

const ReferenceEdocs = () => {
  const [search, setSearch] = useState("");
  const [errMsgPost, setErrMsgPost] = useState("");
  const [addVisible, setAddVisible] = useState(false);
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useEdocs(search);

  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleAdd = () => {
    setAddVisible(true);
  };

  const edocs = data?.pages.flatMap((page) => page.items);

  return (
    <div className="reference-edocs">
      <div className="reference-edocs__title">
        <h3>E-docs</h3>
        <button onClick={handleAdd} disabled={addVisible}>
          Add
        </button>
      </div>
      <div className="reference-edocs__search">
        <label htmlFor="search-edocs">Search</label>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          id="search-edocs"
        />
      </div>
      <div className="reference-edocs__results">
        {error && <div className="reference-edocs__err">{error.message}</div>}
        <>
          <div className="reference-edocs__table-container" ref={rootRef}>
            <table className="reference-edocs__table">
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
                {data && edocs.length > 0
                  ? edocs.map((item, index) =>
                      index === edocs.length - 1 ? (
                        <ReferenceEdocItem
                          item={item}
                          key={item.id}
                          setErrMsgPost={setErrMsgPost}
                          errMsgPost={errMsgPost}
                          lastItemRef={lastItemRef}
                        />
                      ) : (
                        <ReferenceEdocItem
                          item={item}
                          key={item.id}
                          setErrMsgPost={setErrMsgPost}
                          errMsgPost={errMsgPost}
                        />
                      )
                    )
                  : !isFetchingNextPage &&
                    !isPending && <EmptyRow colSpan="6" text="No edocs" />}
                {(isPending || isFetchingNextPage) && (
                  <LoadingRow colSpan="6" />
                )}
              </tbody>
            </table>
          </div>
        </>
      </div>
      {addVisible && (
        <FakeWindow
          title="ADD A NEW E-DOC"
          width={1000}
          height={550}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#94bae8"
          setPopUpVisible={setAddVisible}
        >
          <EdocForm
            setAddVisible={setAddVisible}
            setErrMsgPost={setErrMsgPost}
            errMsgPost={errMsgPost}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default ReferenceEdocs;
