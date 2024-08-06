const InputTelExtToggle = ({ id, name, value, onChange, editVisible }) => {
  return editVisible ? (
    <>
      <label
        htmlFor={id}
        style={{
          marginLeft: "30px",
          marginRight: "10px",
          minWidth: "auto",
        }}
      >
        Ext
      </label>
      <input
        style={{ width: "15%" }}
        type="text"
        value={value}
        onChange={onChange}
        name={name}
        autoComplete="off"
        id={id}
      />
    </>
  ) : (
    <>
      {value && (
        <>
          <label
            style={{
              marginLeft: "30px",
              marginRight: "10px",
              minWidth: "auto",
            }}
          >
            Ext
          </label>
          <p>{value}</p>
        </>
      )}
    </>
  );
};

export default InputTelExtToggle;
