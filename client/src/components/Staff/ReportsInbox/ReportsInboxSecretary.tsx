import React, { useState } from "react";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import ReportInboxFormSecretary from "./ReportInboxFormSecretary";

const ReportsInboxSecretary = () => {
  const [errMsg, setErrMsg] = useState("");
  return (
    <>
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <ReportInboxFormSecretary errMsg={errMsg} setErrMsg={setErrMsg} />
    </>
  );
};

export default ReportsInboxSecretary;
