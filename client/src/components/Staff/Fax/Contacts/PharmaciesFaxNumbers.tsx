import React, { useState } from "react";
import { usePharmaciesSearch } from "../../../../hooks/reactquery/queries/pharmaciesQueries";
import useDebounce from "../../../../hooks/useDebounce";
import useIntersection from "../../../../hooks/useIntersection";
import Input from "../../../UI/Inputs/Input";
import EmptyLi from "../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../UI/Lists/LoadingLi";
import PharmacyFaxNumberItem from "./PharmacyFaxNumberItem";

type PharmaciesFaxNumbersProps = {
  handleCheckContact: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isContactChecked: (faxNumber: string) => boolean;
};

const PharmaciesFaxNumbers = ({
  handleCheckContact,
  isContactChecked,
}: PharmaciesFaxNumbersProps) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  //Queries
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = usePharmaciesSearch(debouncedSearch);
  //Intersection observer
  const { rootRef, targetRef } = useIntersection<HTMLUListElement | null>(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const pharmacies = data?.pages
    ?.flatMap((page) => page.items)
    .filter(({ FaxNumber }) => FaxNumber.phoneNumber);

  return (
    <div className="fax-numbers">
      <label className="fax-numbers__title">Pharmacies</label>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <ul className="fax-numbers__list" ref={rootRef}>
        {error && <li>{error.message}</li>}
        {pharmacies && pharmacies.length > 0
          ? pharmacies.map((pharmacy, index) =>
              index === pharmacies.length - 1 ? (
                <PharmacyFaxNumberItem
                  key={pharmacy.id}
                  pharmacy={pharmacy}
                  targetRef={targetRef}
                  handleCheckContact={handleCheckContact}
                  isContactChecked={isContactChecked}
                />
              ) : (
                <PharmacyFaxNumberItem
                  key={pharmacy.id}
                  pharmacy={pharmacy}
                  handleCheckContact={handleCheckContact}
                  isContactChecked={isContactChecked}
                />
              )
            )
          : !isFetchingNextPage && !isPending && <EmptyLi text="No results" />}
        {(isPending || isFetchingNextPage) && <LoadingLi />}
      </ul>
    </div>
  );
};

export default PharmaciesFaxNumbers;
