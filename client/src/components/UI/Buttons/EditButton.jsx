const EditButton = ({ onClick, disabled }) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      Edit
    </button>
  );
};

export default EditButton;
