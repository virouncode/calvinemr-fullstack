import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React from "react";
import useIntersection from "../../../hooks/useIntersection";
import {
  BillingInfosType,
  BillingType,
  SiteType,
  XanoPaginatedType,
} from "../../../types/api";
import EmptyRow from "../../UI/Tables/EmptyRow";
import LoadingRow from "../../UI/Tables/LoadingRow";
import BillingItem from "./BillingItem";

type BillingTableProps = {
  billings?: BillingType[];
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<BillingType>, unknown>,
      Error
    >
  >;
  isFetching: boolean;
  sites: SiteType[];
  addVisible: boolean;
  isPending: boolean;
  isPendingFees: boolean;
  fees?: { billing_infos: BillingInfosType }[];
};

const BillingTable: React.FC<BillingTableProps> = ({
  billings,
  errMsgPost,
  setErrMsgPost,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
  sites,
  isPending,
  isPendingFees,
  fees,
}) => {
  const { rootRef, targetRef } = useIntersection<HTMLDivElement | null>(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const calculateTotal = (
    key:
      | "provider_fee"
      | "assistant_fee"
      | "specialist_fee"
      | "anaesthetist_fee"
      | "non_anaesthetist_fee",
    divisor = 10000
  ) => {
    if (!fees) return 0.0;
    return (
      fees
        .map(({ billing_infos }) => (billing_infos?.[key] ?? 0) / divisor)
        .reduce((acc, curr) => acc + curr, 0)
        .toFixed(2) || 0.0
    );
  };

  return (
    <div className="billing-table__container" ref={rootRef}>
      <table className="billing-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Date</th>
            <th>Site</th>
            <th>Provider OHIP#</th>
            <th>Referring MD OHIP#</th>
            <th>Patient Health Card#</th>
            <th>Patient name</th>
            <th>Diagnosis code</th>
            <th>Billing code</th>
            <th>Provider fee</th>
            <th>Assistant fee</th>
            <th>Specialist fee</th>
            <th>Anaesthetist fee</th>
            <th>Non-anaesthetist fee</th>
            <th>Updated by</th>
            <th>Updated on</th>
          </tr>
        </thead>
        <tbody>
          {isPending && isPendingFees && <LoadingRow colSpan={16} />}
          {billings && billings.length > 0
            ? billings.map((item, index) =>
                index === billings.length - 1 ? (
                  <BillingItem
                    key={item.id}
                    billing={item}
                    errMsgPost={errMsgPost}
                    setErrMsgPost={setErrMsgPost}
                    sites={sites}
                    targetRef={targetRef}
                  />
                ) : (
                  <BillingItem
                    key={item.id}
                    billing={item}
                    errMsgPost={errMsgPost}
                    setErrMsgPost={setErrMsgPost}
                    sites={sites}
                  />
                )
              )
            : !isFetchingNextPage && (
                <EmptyRow colSpan={16} text="No Billings" />
              )}
          {isFetchingNextPage && <LoadingRow colSpan={16} />}
        </tbody>
        <tfoot>
          <tr
            className="billing-table__item"
            style={{ backgroundColor: "#FEFEFE" }}
          >
            <td colSpan={8} style={{ fontWeight: "bold", border: "none" }}>
              Total fees
            </td>
            <td style={{ fontWeight: "bold", border: "none" }}>
              Nbr of billings: {fees?.length ?? 0}
            </td>
            <td style={{ border: "none" }}>
              {calculateTotal("provider_fee")} $
            </td>
            <td style={{ border: "none" }}>
              {calculateTotal("assistant_fee")} $
            </td>
            <td style={{ border: "none" }}>
              {calculateTotal("specialist_fee")} $
            </td>
            <td style={{ border: "none" }}>
              {calculateTotal("anaesthetist_fee")} $
            </td>
            <td style={{ border: "none" }}>
              {calculateTotal("non_anaesthetist_fee")} $
            </td>
            <td colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default BillingTable;
