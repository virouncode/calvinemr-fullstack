import React from "react";
import { useFaxDirectory } from "../../../../hooks/reactquery/queries/faxDirectoryQueries";
import useIntersection from "../../../../hooks/useIntersection";
import LoadingLi from "../../../UI/Lists/LoadingLi";
import OtherFaxNumberItem from "./OtherFaxNumberItem";

type OthersFaxNumbersProps = {
  handleCheckContact: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isContactChecked: (faxNumber: string) => boolean;
};

const OthersFaxNumbers = ({
  handleCheckContact,
  isContactChecked,
}: OthersFaxNumbersProps) => {
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
              handleCheckContact={handleCheckContact}
              isContactChecked={isContactChecked}
            />
          ) : (
            <OtherFaxNumberItem
              key={other.id}
              other={other}
              handleCheckContact={handleCheckContact}
              isContactChecked={isContactChecked}
            />
          )
        )}
      </ul>
    </div>
  );
};

export default OthersFaxNumbers;
