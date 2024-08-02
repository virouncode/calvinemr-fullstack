import { useTopic } from "../../../hooks/reactquery/queries/topicQueries";
import useIntersection from "../../../hooks/useIntersection";
import LoadingLi from "../../UI/Lists/LoadingLi";
import PharmacyFaxNumberItem from "./PharmacyFaxNumberItem";

const PharmaciesFaxNumbers = ({ handleClickPharmacy }) => {
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useTopic("PHARMACIES", 0);
  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  if (isPending)
    return (
      <div className="fax-numbers">
        <label className="fax-numbers__title">Pharmacies</label>
        <ul className="fax-numbers__list">
          <LoadingLi />
        </ul>
      </div>
    );
  if (error)
    return (
      <div className="fax-numbers">
        <label className="fax-numbers__title">Pharmacies</label>
        <ul className="fax-numbers__list">
          <li>{error.message}</li>
        </ul>
      </div>
    );

  const pharmacies = data.pages
    ?.flatMap((page) => page.items)
    .filter(({ FaxNumber }) => FaxNumber.phoneNumber);

  return (
    <div className="fax-numbers">
      <label className="fax-numbers__title">Pharmacies</label>
      <ul className="fax-numbers__list" ref={rootRef}>
        {pharmacies.map((pharmacy, index) =>
          index === pharmacies.length - 1 ? (
            <PharmacyFaxNumberItem
              key={pharmacy.id}
              pharmacy={pharmacy}
              lastItemRef={lastItemRef}
              handleClickPharmacy={handleClickPharmacy}
            />
          ) : (
            <PharmacyFaxNumberItem
              key={pharmacy.id}
              pharmacy={pharmacy}
              handleClickPharmacy={handleClickPharmacy}
            />
          )
        )}
      </ul>
    </div>
  );
};

export default PharmaciesFaxNumbers;
