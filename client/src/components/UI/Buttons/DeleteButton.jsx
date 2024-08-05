const DeleteButton = ({ onClick, disabled = false }) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      Delete
    </button>
  );
};

export default DeleteButton;
