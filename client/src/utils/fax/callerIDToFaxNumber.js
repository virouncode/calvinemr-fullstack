export const callerIDToFaxNumber = (callerID) => {
  let faxNumber;
  if (callerID.length >= 11) {
    faxNumber = callerID.slice(1);
  } else {
    faxNumber = callerID;
  }
  return faxNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
};
