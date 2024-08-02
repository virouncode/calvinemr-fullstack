import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useUserContext from "../../../hooks/context/useUserContext";
import { useBillings } from "../../../hooks/reactquery/queries/billingQueries";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import {
  getEndOfTheMonthTZ,
  getStartOfTheMonthTZ,
} from "../../../utils/dates/formatDates";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import BillingFilter from "./BillingFilter";
import BillingForm from "./BillingForm";
import BillingTable from "./BillingTable";

const Billing = () => {
  const { pid } = useParams();
  const { user } = useUserContext();
  const [addVisible, setAddVisible] = useState(pid ? true : false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [rangeStart, setRangeStart] = useState(getStartOfTheMonthTZ()); //start of the month
  const [rangeEnd, setRangeEnd] = useState(getEndOfTheMonthTZ()); //end of the month
  const [all, setAll] = useState(false);
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

  const initialRangeStart = useRef(rangeStart);
  const initialRangeEnd = useRef(rangeEnd);

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
        <ErrorParagraph errorMsg={error?.message || errorSites?.message} />
      </div>
    );
  const billings = data?.pages.flatMap((page) => page.items);

  return (
    <div className="billing">
      <div className="billing__btn-container">
        {user.title !== "Secretary" && (
          <button onClick={handleAdd} disabled={addVisible}>
            Add Billing
          </button>
        )}
      </div>
      {errMsgPost && <p className="billing__err">{errMsgPost}</p>}
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
    </div>
  );
};

export default Billing;
