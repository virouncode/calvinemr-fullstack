const BillingCodesTextarea = ({ value, onChange, onClick }) => {
  return (
    <>
      <label htmlFor="billing_codes">Billing code(s)*</label>
      <textarea
        placeholder="A001,B423,F404,..."
        value={value}
        name="billing_codes"
        onChange={onChange}
        autoComplete="off"
        rows={2}
        style={{
          padding: "5px 20px 5px 5px",
          whiteSpace: "pre-wrap",
          width: "170px",
        }}
        id="billing_codes"
      />
      <i
        style={{
          cursor: "pointer",
          position: "absolute",
          right: "5px",
        }}
        className="fa-solid fa-magnifying-glass"
        onClick={onClick}
      ></i>
    </>
  );
};

export default BillingCodesTextarea;
