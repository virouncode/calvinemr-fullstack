const DeleteButton = ({ onClick, disabled }) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      Delete
    </button>
  );
};

export default DeleteButton;
