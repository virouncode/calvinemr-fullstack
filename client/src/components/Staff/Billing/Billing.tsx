import React, { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useBillings,
  useBillingsFees,
} from "../../../hooks/reactquery/queries/billingQueries";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import useDebounce from "../../../hooks/useDebounce";
import { AdminType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import {
  getEndOfTheMonthTZ,
  getStartOfTheMonthTZ,
} from "../../../utils/dates/formatDates";
import Button from "../../UI/Buttons/Button";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import BillingFilter from "./BillingFilter";
import BillingForm from "./BillingForm";
import BillingTable from "./BillingTable";

const Billing = () => {
  //Hooks
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");
  const { user } = useUserContext() as { user: UserStaffType | AdminType };
  const [addVisible, setAddVisible] = useState(patientId ? true : false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [serviceOrEntry, setServiceOrEntry] = useState<"service" | "entry">(
    "service"
  );
  const [rangeStart, setRangeStart] = useState(getStartOfTheMonthTZ()); //start of the month
  const [rangeEnd, setRangeEnd] = useState(getEndOfTheMonthTZ()); //end of the month
  const [search, setSearch] = useState("");
  const [all, setAll] = useState(false);
  const initialRangeStart = useRef(rangeStart);
  const initialRangeEnd = useRef(rangeEnd);
  //Queries
  const debouncedSearch = useDebounce(search, 300);
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useBillings(rangeStart, rangeEnd, serviceOrEntry, debouncedSearch);

  const {
    data: fees,
    isPending: isPendingFees,
    error: errorFees,
  } = useBillingsFees(rangeStart, rangeEnd, serviceOrEntry, debouncedSearch);

  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();

  const handleAdd = () => {
    setAddVisible(true);
  };

  if (isPendingSites)
    return (
      <div className="billing">
        <LoadingParagraph />
      </div>
    );

  if (error || errorSites || errorFees)
    return (
      <div className="billing">
        <ErrorParagraph
          errorMsg={
            error?.message || errorSites?.message || errorFees?.message || ""
          }
        />
      </div>
    );

  const billings = data?.pages.flatMap((page) => page.items);

  return (
    <>
      <div className="billing__btn">
        {user.title !== "Secretary" && (
          <Button
            onClick={handleAdd}
            disabled={addVisible}
            label="Add Billing"
          />
        )}
      </div>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      {addVisible && (
        <BillingForm
          setAddVisible={setAddVisible}
          setErrMsgPost={setErrMsgPost}
          errMsgPost={errMsgPost}
          sites={sites}
        />
      )}
      <BillingFilter
        billings={billings}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        search={search}
        setSearch={setSearch}
        setRangeStart={setRangeStart}
        setRangeEnd={setRangeEnd}
        all={all}
        setAll={setAll}
        initialRangeStart={initialRangeStart}
        initialRangeEnd={initialRangeEnd}
        serviceOrEntry={serviceOrEntry}
        setServiceOrEntry={setServiceOrEntry}
      />
      <BillingTable
        isPending={isPending}
        isPendingFees={isPendingFees}
        fees={fees}
        billings={billings}
        errMsgPost={errMsgPost}
        setErrMsgPost={setErrMsgPost}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
        sites={sites}
        addVisible={addVisible}
      />
    </>
  );
};

export default Billing;
