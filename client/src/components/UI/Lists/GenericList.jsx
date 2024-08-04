const GenericList = ({
  list,
  value,
  name,
  handleChange,
  placeHolder,
  noneOption = true,
  id = null,
  label,
}) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <select value={value} name={name} onChange={handleChange} id={id}>
        <option value="" disabled>
          {placeHolder}
        </option>
        {noneOption && <option value="">(None)</option>}
        {list.map((item) => (
          <option value={item.code} key={item.code}>
            {item.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default GenericList;
