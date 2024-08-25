import React from "react";
import { useFaxDirectory } from "../../../../hooks/reactquery/queries/faxDirectoryQueries";
import useIntersection from "../../../../hooks/useIntersection";
import { FaxContactType } from "../../../../types/api";
import LoadingLi from "../../../UI/Lists/LoadingLi";
import OtherFaxNumberItem from "./OtherFaxNumberItem";

type OthersFaxNumbersProps = {
  handleClickOther: (other: FaxContactType) => void;
};

const OthersFaxNumbers = ({ handleClickOther }: OthersFaxNumbersProps) => {
  //Queries
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useFaxDirectory();
  //Intersection observer
  const { ulRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  if (isPending)
    return (
      <div className="fax-numbers">
        <label className="fax-numbers__title">Others</label>
        <ul className="fax-numbers__list">
          <LoadingLi />
        </ul>
      </div>
    );
  if (error)
    return (
      <div className="fax-numbers">
        <label className="fax-numbers__title">Others</label>
        <ul className="fax-numbers__list">
          <li>{error.message}</li>
        </ul>
      </div>
    );

  const others = data.pages?.flatMap((page) => page.items);

  return (
    <div className="fax-numbers">
      <label className="fax-numbers__title">Others</label>
      <ul className="fax-numbers__list" ref={ulRef}>
        {others.map((other, index) =>
          index === others.length - 1 ? (
            <OtherFaxNumberItem
              key={other.id}
              other={other}
              lastItemRef={lastItemRef}
              handleClickOther={handleClickOther}
            />
          ) : (
            <OtherFaxNumberItem
              key={other.id}
              other={other}
              handleClickOther={handleClickOther}
            />
          )
        )}
      </ul>
    </div>
  );
};

export default OthersFaxNumbers;
