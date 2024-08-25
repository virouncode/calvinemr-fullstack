import React from "react";
import { CycleType } from "../../../../../types/api";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import Button from "../../../../UI/Buttons/Button";
import SignCell from "../../../../UI/Tables/SignCell";

type CycleItemProps = {
  item: CycleType;
  errMsgPost: string;
  lastItemRef?: (node: Element | null) => void;
  setCycleToShow: React.Dispatch<React.SetStateAction<CycleType | undefined>>;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const CycleItem = ({
  item,
  errMsgPost,
  lastItemRef,
  setCycleToShow,
  setShow,
}: CycleItemProps) => {
  const handleClickShow = () => {
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
          <Button onClick={handleClickShow} label="Show" />
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
