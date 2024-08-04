const LinkButton = ({ label, onClick, disabled, url }) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      <a href={url} rel="noreferrer">
        {label}
      </a>
    </button>
  );
};

export default LinkButton;
