import React, { useState } from "react";
import { usePamphlets } from "../../../hooks/reactquery/queries/pamphletsQueries";
import useIntersection from "../../../hooks/useIntersection";
import Input from "../../UI/Inputs/Input";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import EmptyRow from "../../UI/Tables/EmptyRow";
import LoadingRow from "../../UI/Tables/LoadingRow";
import PatientPamphletItem from "./PatientPamhpletItem";

const PatientPamphlets = () => {
  const [search, setSearch] = useState("");
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = usePamphlets(search);

  //INTERSECTION OBSERVER
  const { divRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const pamphlets = data?.pages.flatMap((page) => page.items);

  return (
    <div className="patient-pamphlets">
      <div className="patient-pamphlets__search">
        <Input
          value={search}
          onChange={handleSearch}
          id="search-pamphlets"
          label="Search"
          width={300}
        />
      </div>
      <div className="patient-pamphlets__results">
        {error && <ErrorParagraph errorMsg={error.message} />}
        <>
          <div className="patient-pamphlets__table-container" ref={divRef}>
            <table className="patient-pamphlets__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>File</th>
                  <th>Notes</th>
                  <th>Created by</th>
                  <th>Created on</th>
                </tr>
              </thead>
              <tbody>
                {data && pamphlets && pamphlets?.length > 0
                  ? pamphlets.map((item, index) =>
                      index === pamphlets.length - 1 ? (
                        <PatientPamphletItem
                          item={item}
                          key={item.id}
                          lastItemRef={lastItemRef}
                        />
                      ) : (
                        <PatientPamphletItem item={item} key={item.id} />
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
    </div>
  );
};

export default PatientPamphlets;
