import ArrowDownIcon from "../../../UI/Icons/ArrowDownIcon";
import ArrowUpIcon from "../../../UI/Icons/ArrowUpIcon";

const OrderPicker = ({ handleChangeOrder, addVisible, order }) => {
  return (
    <>
      <strong>Most recent on:</strong>
      <span
        onClick={handleChangeOrder}
        style={{ opacity: addVisible && "0.3" }}
      >
        {order === "asc" ? (
          <ArrowDownIcon ml={5} mr={2} />
        ) : (
          <ArrowUpIcon ml={5} mr={2} />
        )}
        {order === "asc" ? "Bottom" : "Top"}
      </span>
    </>
  );
};

export default OrderPicker;
