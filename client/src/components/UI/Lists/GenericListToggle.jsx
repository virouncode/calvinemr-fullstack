import { toCodeTableName } from "../../../omdDatas/codesTables";

const GenericListToggle = ({
  list,
  value,
  name,
  handleChange,
  placeHolder,
  noneOption = true,
  id = null,
  label,
  editVisible,
}) => {
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      {editVisible ? (
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
      ) : (
        <p>{toCodeTableName(list, value)}</p>
      )}
    </>
  );
};

export default GenericListToggle;
