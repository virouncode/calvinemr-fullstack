import { useState } from "react";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import ReportsInboxFormSecretary from "./ReportsInboxFormSecretary";

const ReportsInboxSecretary = () => {
  const [errMsg, setErrMsg] = useState("");
  return (
    <>
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <h2 className="reportsinbox__subtitle">Add a report</h2>
      <ReportsInboxFormSecretary errMsg={errMsg} setErrMsg={setErrMsg} />
    </>
  );
};

export default ReportsInboxSecretary;
