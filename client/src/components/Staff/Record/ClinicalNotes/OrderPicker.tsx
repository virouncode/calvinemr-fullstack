import React from "react";
import ArrowDownIcon from "../../../UI/Icons/ArrowDownIcon";
import ArrowUpIcon from "../../../UI/Icons/ArrowUpIcon";

type OrderPickerProps = {
  handleChangeOrder: () => void;
  addVisible: boolean;
  order: string;
};

const OrderPicker = ({
  handleChangeOrder,
  addVisible,
  order,
}: OrderPickerProps) => {
  return (
    <>
      <strong>Most recent on:</strong>
      <span
        onClick={handleChangeOrder}
        style={{ opacity: addVisible ? "0.3" : "1" }}
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
