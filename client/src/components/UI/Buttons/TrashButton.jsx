const TrashButton = ({ onClick, ml = 0 }) => {
  return (
    <i
      className="fa-solid fa-trash"
      style={{ marginLeft: `${ml}px`, cursor: "pointer" }}
      onClick={onClick}
    />
  );
};

export default TrashButton;
