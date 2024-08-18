import React from "react";
import TrashIcon from "../../UI/Icons/TrashIcon";
import Input from "../../UI/Inputs/Input";

type RoomItemProps = {
  room: { id: string; title: string };
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
        {room.id}
      </div>
      <Input
        value={room.title}
        onChange={(e) => handleChangeRoomTitle(e, room.id)}
        name="room-name"
        id="room-name"
        label="Name*:"
      />
      <TrashIcon onClick={() => handleDeleteRoom(room.id)} ml={10} />
    </li>
  );
};

export default RoomItem;
