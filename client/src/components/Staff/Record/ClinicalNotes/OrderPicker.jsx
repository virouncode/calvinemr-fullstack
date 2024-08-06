const OrderPicker = ({ handleChangeOrder, addVisible, order }) => {
  return (
    <>
      <strong>Most recent on:</strong>
      <span
        onClick={handleChangeOrder}
        style={{ opacity: addVisible && "0.3" }}
      >
        {order === "asc" ? (
          <i
            className="fa-solid fa-arrow-down"
            style={{
              marginLeft: "5px",
              marginRight: "2px",
              cursor: "pointer",
            }}
          ></i>
        ) : (
          <i
            className="fa-solid fa-arrow-up"
            style={{
              marginLeft: "5px",
              marginRight: "2px",
              cursor: "pointer",
            }}
          ></i>
        )}
        {order === "asc" ? "Bottom" : "Top"}
      </span>
    </>
  );
};

export default OrderPicker;
