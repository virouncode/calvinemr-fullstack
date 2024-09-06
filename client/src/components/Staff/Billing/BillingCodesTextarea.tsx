import React from "react";
import MagnifyingGlassIcon from "../../UI/Icons/MagnifyingGlassIcon";

type BillingCodesTextareaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
};

const BillingCodesTextarea = ({
  value,
  onChange,
  onClick,
}: BillingCodesTextareaProps) => {
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
        }}
        id="billing_codes"
      />
      <MagnifyingGlassIcon right={5} top={5} onClick={onClick} />
    </>
  );
};

export default BillingCodesTextarea;
