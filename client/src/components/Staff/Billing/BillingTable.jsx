
import useIntersection from "../../../hooks/useIntersection";
import EmptyRow from "../../UI/Tables/EmptyRow";
import LoadingRow from "../../UI/Tables/LoadingRow";
import BillingTableItem from "./BillingTableItem";

const BillingTable = ({
  billings,
  errMsgPost,
  setErrMsgPost,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
  sites,
  addVisible,
}) => {
  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  return (
    <div
      className="billing-table__container"
      ref={rootRef}
      style={{ height: addVisible && "56%" }}
    >
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
          {billings && billings.length > 0
            ? billings.map((item, index) =>
                index === billings.length - 1 ? (
                  <BillingTableItem
                    key={item.id}
                    billing={item}
                    errMsgPost={errMsgPost}
                    setErrMsgPost={setErrMsgPost}
                    sites={sites}
                    lastItemRef={lastItemRef}
                  />
                ) : (
                  <BillingTableItem
                    key={item.id}
                    billing={item}
                    errMsgPost={errMsgPost}
                    setErrMsgPost={setErrMsgPost}
                    sites={sites}
                  />
                )
              )
            : !isFetchingNextPage && (
                <EmptyRow colSpan="13" text="No Billings" />
              )}
          {isFetchingNextPage && <LoadingRow colSpan="13" />}
        </tbody>
        <tfoot>
          <tr className="billing-table__item">
            <td colSpan="8" style={{ fontWeight: "bold", border: "none" }}>
              Total fees
            </td>
            <td style={{ fontWeight: "bold", border: "none" }}>
              Nbr of billings: {billings.length}
            </td>
            <td style={{ border: "none" }}>
              {Math.round(
                billings
                  .map(
                    ({ billing_infos }) => billing_infos.provider_fee / 10000
                  )
                  .reduce((acc, current) => {
                    return acc + current;
                  }, 0) * 100
              ) / 100}{" "}
              $
            </td>
            <td style={{ border: "none" }}>
              {Math.round(
                billings
                  .map(
                    ({ billing_infos }) => billing_infos.assistant_fee / 10000
                  )
                  .reduce((acc, current) => {
                    return acc + current;
                  }, 0) * 100
              ) / 100}{" "}
              $
            </td>
            <td style={{ border: "none" }}>
              {Math.round(
                billings
                  .map(
                    ({ billing_infos }) => billing_infos.specialist_fee / 10000
                  )
                  .reduce((acc, current) => {
                    return acc + current;
                  }, 0) * 100
              ) / 100}{" "}
              $
            </td>
            <td style={{ border: "none" }}>
              {Math.round(
                billings
                  .map(
                    ({ billing_infos }) =>
                      billing_infos.anaesthetist_fee / 10000
                  )
                  .reduce((acc, current) => {
                    return acc + current;
                  }, 0) * 100
              ) / 100}{" "}
              $
            </td>
            <td style={{ border: "none" }}>
              {Math.round(
                billings
                  .map(
                    ({ billing_infos }) =>
                      billing_infos.non_anaesthetist_fee / 10000
                  )
                  .reduce((acc, current) => {
                    return acc + current;
                  }, 0) * 100
              ) / 100}{" "}
              $
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default BillingTable;
