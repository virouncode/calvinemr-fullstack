import MagnifyingGlassIcon from "../Icons/MagnifyingGlassIcon";

const InputWithSearchInTable = ({
  id,
  name,
  value,
  onChange,
  onClick,
  label,
  readOnly,
  logo = true,
}) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="text"
        value={value}
        name={name}
        onChange={onChange}
        readOnly={readOnly}
        id={id}
      />
      {logo && <MagnifyingGlassIcon right={12} top={17} onClick={onClick} />}
    </>
  );
};

export default InputWithSearchInTable;
