const EditButton = ({ onClick, disabled = false }) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      Edit
    </button>
  );
};

export default EditButton;
