import React from "react";
import { useTopic } from "../../../../hooks/reactquery/queries/topicQueries";
import useIntersection from "../../../../hooks/useIntersection";
import { PharmacyType } from "../../../../types/api";
import LoadingLi from "../../../UI/Lists/LoadingLi";
import PharmacyFaxNumberItem from "./PharmacyFaxNumberItem";

type PharmaciesFaxNumbersProps = {
  handleClickPharmacy: (pharmacy: PharmacyType) => void;
};

const PharmaciesFaxNumbers = ({
  handleClickPharmacy,
}: PharmaciesFaxNumbersProps) => {
  //Queries
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useTopic("PHARMACIES", 0);
  //Intersection observer
  const { ulRef, lastItemRef } = useIntersection(
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
      <ul className="fax-numbers__list" ref={ulRef}>
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
