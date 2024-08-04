import { useState } from "react";
import { usePamphlets } from "../../../hooks/reactquery/queries/pamphletsQueries";
import useIntersection from "../../../hooks/useIntersection";
import Button from "../../UI/Buttons/Button";
import EmptyRow from "../../UI/Tables/EmptyRow";
import LoadingRow from "../../UI/Tables/LoadingRow";
import FakeWindow from "../../UI/Windows/FakeWindow";
import PamphletForm from "./PamphletForm";
import PamphletItem from "./PamphletItem";

const Pamphlets = () => {
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
  } = usePamphlets(search);

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

  const pamphlets = data?.pages.flatMap((page) => page.items);

  return (
    <div className="reference-edocs">
      <div className="reference-edocs__title">
        <h3>Pamphlets</h3>
        <Button onClick={handleAdd} disabled={addVisible} label="Add" />
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
                {data && pamphlets.length > 0
                  ? pamphlets.map((item, index) =>
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
                    !isPending && <EmptyRow colSpan="6" text="No pamphlets" />}
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
