const PlusButton = ({ onClick, className }) => {
  return (
    <button type="button" onClick={onClick} className={className}>
      +
    </button>
  );
};

export default PlusButton;
