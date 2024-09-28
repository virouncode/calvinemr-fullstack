import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useUserContext from "../../../hooks/context/useUserContext";
import { useBillings } from "../../../hooks/reactquery/queries/billingQueries";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
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
  const { pid } = useParams();
  const { user } = useUserContext() as { user: UserStaffType | AdminType };
  const [addVisible, setAddVisible] = useState(pid ? true : false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [rangeStart, setRangeStart] = useState(getStartOfTheMonthTZ()); //start of the month
  const [rangeEnd, setRangeEnd] = useState(getEndOfTheMonthTZ()); //end of the month
  const [all, setAll] = useState(false);
  const initialRangeStart = useRef(rangeStart);
  const initialRangeEnd = useRef(rangeEnd);
  //Queries
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useBillings(rangeStart, rangeEnd);
  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();

  const handleAdd = () => {
    setAddVisible(true);
  };

  if (isPending || isPendingSites)
    return (
      <div className="billing">
        <LoadingParagraph />
      </div>
    );
  if (error || errorSites)
    return (
      <div className="billing">
        <ErrorParagraph
          errorMsg={error?.message || errorSites?.message || ""}
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
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        setRangeStart={setRangeStart}
        setRangeEnd={setRangeEnd}
        all={all}
        setAll={setAll}
        initialRangeStart={initialRangeStart}
        initialRangeEnd={initialRangeEnd}
      />
      <BillingTable
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
