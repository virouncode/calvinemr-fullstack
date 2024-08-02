
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import SignCell from "../../../../UI/Tables/SignCell";

const CycleItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  lastItemRef,
  topicPut,
  setCycleToShow,
  setShow,
}) => {
  const handleClickShow = (e) => {
    setCycleToShow(item);
    setShow(true);
  };
  return (
    <tr
      className="cycles-item"
      style={{
        border: errMsgPost && "solid 1.5px red",
        backgroundColor: item.status === "Active" ? "#FEFEFE" : "#cecdcd",
      }}
      ref={lastItemRef}
    >
      <td>
        <div className="cycles-item__btn-container">
          <button onClick={handleClickShow}>Show</button>
        </div>
      </td>
      <td>{item.status}</td>
      <td>{item.cycle_nbr}</td>
      <td>{timestampToDateISOTZ(item.lmp)}</td>
      <td>{item.cycle_type}</td>
      <SignCell item={item} />
    </tr>
  );
};

export default CycleItem;
