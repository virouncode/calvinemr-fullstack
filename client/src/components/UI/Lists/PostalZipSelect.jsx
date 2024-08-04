const PostalZipSelect = ({ onChange, postalOrZip }) => {
  return (
    <>
      <label htmlFor="postalZipCode">Postal/zip code*:</label>
      <select
        style={{ width: "15%", marginRight: "10px" }}
        name="PostalOrZip"
        value={postalOrZip}
        onChange={onChange}
        id="postalZipCode"
      >
        <option value="postal">Postal</option>
        <option value="zip">Zip</option>
      </select>
    </>
  );
};

export default PostalZipSelect;
