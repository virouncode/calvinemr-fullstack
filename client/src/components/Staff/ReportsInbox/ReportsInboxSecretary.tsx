import React, { useState } from "react";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import ReportInboxFormSecretary from "./ReportInboxFormSecretary";

const ReportsInboxSecretary = () => {
  const [errMsg, setErrMsg] = useState("");
  return (
    <>
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <h2 className="reportsinbox__subtitle">Add a report</h2>
      <ReportInboxFormSecretary errMsg={errMsg} setErrMsg={setErrMsg} />
    </>
  );
};

export default ReportsInboxSecretary;
