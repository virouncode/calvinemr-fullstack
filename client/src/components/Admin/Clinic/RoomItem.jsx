import TrashIcon from "../../UI/Icons/TrashIcon";
import Input from "../../UI/Inputs/Input";

const RoomItem = ({ room, handleDeleteRoom, handleChangeRoomTitle }) => {
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
      <TrashIcon onClick={(e) => handleDeleteRoom(e, room.id)} ml={10} />
    </li>
  );
};

export default RoomItem;
