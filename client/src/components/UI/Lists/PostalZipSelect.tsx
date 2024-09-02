import React from "react";
type PostalZipSelectProps = {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  postalOrZip: string;
  label?: boolean;
};

const PostalZipSelect = ({
  onChange,
  postalOrZip,
  label = true,
}: PostalZipSelectProps) => {
  return (
    <>
      {label && <label htmlFor="postalZipCode">Postal/Zip code*:</label>}
      <select
        style={{ width: "15%", marginRight: "10px" }}
        name="PostalOrZip"
        value={postalOrZip}
        onChange={onChange}
        id="postalZipCode"
      >
        <option value="" disabled>
          Choose...
        </option>
        <option value="postal">Postal</option>
        <option value="zip">Zip</option>
      </select>
    </>
  );
};

export default PostalZipSelect;
