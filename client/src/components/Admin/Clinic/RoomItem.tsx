import React from "react";
import { RoomType } from "../../../types/api";
import TrashIcon from "../../UI/Icons/TrashIcon";
import Input from "../../UI/Inputs/Input";

type RoomItemProps = {
  room: RoomType;
  handleDeleteRoom: (id: string) => void;
  handleChangeRoomTitle: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => void;
};

const RoomItem = ({
  room,
  handleDeleteRoom,
  handleChangeRoomTitle,
}: RoomItemProps) => {
  return (
    <li className="site-form__room-item">
      <div className="site-form__room-item-id">
        <label>ID*:</label>
        <p>{room.id}</p>
      </div>
      <div className="site-form__room-item-input">
        <Input
          value={room.title}
          onChange={(e) => handleChangeRoomTitle(e, room.id)}
          name="room-name"
          id="room-name"
          label="Name*:"
        />
        <TrashIcon onClick={() => handleDeleteRoom(room.id)} ml={10} />
      </div>
    </li>
  );
};

export default RoomItem;
