import { useFaxDirectory } from "../../../hooks/reactquery/queries/faxDirectoryQueries";
import useIntersection from "../../../hooks/useIntersection";
import LoadingLi from "../../UI/Lists/LoadingLi";
import OtherFaxNumberItem from "./OtherFaxNumberItem";

const OthersFaxNumbers = ({ handleClickOther }) => {
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useFaxDirectory();
  const { rootRef, lastItemRef } = useIntersection(
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
      <ul className="fax-numbers__list" ref={rootRef}>
        {others.map((other, index) =>
          index === other.length - 1 ? (
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
