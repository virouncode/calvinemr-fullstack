import React from "react";
import Input from "../Inputs/Input";
type PostalZipSelectInputProps = {
  onChangeSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  postalOrZip: string;
  label?: boolean;
  value: string;
  inputWidth?: number;
  id: string;
  placeholder: string;
  name: string;
};

const PostalZipSelectInput = ({
  onChangeSelect,
  onChangeInput,
  postalOrZip,
  label = true,
  value,
  inputWidth,
  id,
  placeholder,
  name,
}: PostalZipSelectInputProps) => {
  return (
    <>
      {label && <label htmlFor="postalZipCode">Postal/Zip code*</label>}
      <div className="postalzip-select-input">
        <select
          name="PostalOrZip"
          value={postalOrZip}
          onChange={onChangeSelect}
          id="postalZipCode"
        >
          <option value="" disabled>
            Choose...
          </option>
          <option value="postal">Postal</option>
          <option value="zip">Zip</option>
        </select>
        <Input
          value={value}
          onChange={onChangeInput}
          name={name}
          id={id}
          width={inputWidth}
          placeholder={placeholder}
        />
      </div>
    </>
  );
};

export default PostalZipSelectInput;
