const RoomItem = ({ room, handleDeleteRoom, handleChangeRoomTitle }) => {
  return (
    <li className="site-form__room-item">
      <div className="site-form__room-item-id">
        <label>ID*:</label>
        {room.id}
      </div>
      <label htmlFor="room-name">Name*:</label>
      <input
        value={room.title}
        onChange={(e) => handleChangeRoomTitle(e, room.id)}
        id="room-name"
      />
      <i
        className="fa-solid fa-trash  message-detail__trash"
        onClick={(e) => handleDeleteRoom(e, room.id)}
      ></i>
    </li>
  );
};

export default RoomItem;
