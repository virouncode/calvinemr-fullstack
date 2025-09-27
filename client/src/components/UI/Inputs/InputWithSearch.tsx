import { useMediaQuery } from "@mui/material";
import React from "react";
import MagnifyingGlassIcon from "../Icons/MagnifyingGlassIcon";

type InputWithSearchProps = {
  id: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  label?: string;
  readOnly?: boolean;
  logo?: boolean;
  width?: number;
  disabled?: boolean;
};

const InputWithSearch = ({
  id,
  name,
  value,
  onChange,
  onClick,
  label,
  readOnly,
  logo = true,
  width,
  disabled = false,
}: InputWithSearchProps) => {
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type="text"
        value={value}
        name={name}
        onChange={onChange}
        readOnly={readOnly}
        id="provider_ohip_billing_nbr"
        style={{ width: width ? `${width}px` : "" }}
      />

      {logo && !disabled && (
        <MagnifyingGlassIcon
          right={5}
          top={isTabletOrMobile ? 32 : 28}
          onClick={onClick}
        />
      )}
    </>
  );
};

export default InputWithSearch;
