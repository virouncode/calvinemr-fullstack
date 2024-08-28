export const formatToE164Canadian = (phoneNumber: string): string => {
  const countryCode = "+1";
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  if (digitsOnly.length !== 10) {
    console.error("Invalid phone number length");
    return "";
  }
  const e164Number = `${countryCode}${digitsOnly}`;

  return e164Number;
};
