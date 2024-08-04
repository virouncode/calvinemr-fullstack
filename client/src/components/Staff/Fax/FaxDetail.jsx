import uniqueId from "lodash/uniqueId";
import { useState } from "react";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useUserContext from "../../../hooks/context/useUserContext";
import { useFaxDelete } from "../../../hooks/reactquery/mutations/faxMutations";
import { useFax } from "../../../hooks/reactquery/queries/faxQueries";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import Button from "../../UI/Buttons/Button";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import CircularProgressSmall from "../../UI/Progress/CircularProgressSmall";
import FakeWindow from "../../UI/Windows/FakeWindow";
import ReportsInboxForm from "../ReportsInbox/ReportsInboxForm";
import Fax from "./Fax";
import NewFax from "./NewFax";

const FaxDetail = ({
  setCurrentFaxId,
  currentFaxId,
  currentCallerId,
  section,
}) => {
  const { user } = useUserContext();
  const [forwardVisible, setForwardVisible] = useState(false);
  const [addToReportsVisible, setAddToReportsVisible] = useState(false);
  const [replyVisible, setReplyVisible] = useState(false);
  const [attachmentToForward, setAttachmentToForward] = useState(null);
  const [progress, setProgress] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  // const messageContentRef = useRef(null);
  const {
    data: fax,
    isPending,
    error,
  } = useFax(currentFaxId, section === "Received faxes" ? "IN" : "OUT");

  const faxDelete = useFaxDelete();

  const handleClickBack = () => {
    setCurrentFaxId(0);
  };

  const handleDeleteFax = async () => {
    if (
      await confirmAlert({
        content: `Do you really want to delete this fax ? (this action is irreversible)`,
      })
    ) {
      const faxToDelete = {
        faxFileName: currentFaxId,
        direction: section === "Received faxes" ? "IN" : "OUT",
      };
      faxDelete.mutate(faxToDelete, {
        onSuccess: () => {
          setCurrentFaxId(0);
        },
      });
    }
  };

  const handleClickReply = async () => {
    setProgress(true);
    const response = await xanoPost("/upload/attachment", "staff", {
      content: "data:application/pdf;base64," + fax,
    });
    setAttachmentToForward({
      file: response,
      alias: "initial_fax.pdf",
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
      created_by_user_type: "staff",
      id: uniqueId("messages_attachment_"),
    });
    setProgress(false);
    setReplyVisible(true);
  };

  const handleClickForward = async () => {
    setProgress(true);
    const response = await xanoPost("/upload/attachment", "staff", {
      content: "data:application/pdf;base64," + fax,
    });
    setAttachmentToForward({
      file: response,
      alias: "fax_forwarded.pdf",
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
      created_by_user_type: "staff",
      id: uniqueId("messages_attachment_"),
    });
    setForwardVisible(true);
    setProgress(false);
  };

  const handleAddToReports = async () => {
    setProgress(true);
    const response = await xanoPost("/upload/attachment", "staff", {
      content: "data:application/pdf;base64," + fax,
    });
    setAttachmentToForward({
      file: response,
      alias: "fax_forwarded.pdf",
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
      created_by_user_type: "staff",
      id: uniqueId("messages_attachment_"),
    });
    setAddToReportsVisible(true);
    setProgress(false);
  };

  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;

  return (
    fax && (
      <>
        <div className="fax-detail__toolbar">
          <i
            className="fa-solid fa-arrow-left fax-detail__arrow"
            style={{ cursor: "pointer" }}
            onClick={handleClickBack}
          />
          <div className="fax-detail__toolbar-btns">
            <Button
              disabled={progress}
              onClick={handleAddToReports}
              label="Add to patient reports"
            />
            <Button
              disabled={progress}
              onClick={handleClickForward}
              label="Forward"
            />
            {section === "Received faxes" && (
              <Button
                disabled={progress}
                onClick={handleClickReply}
                label="Reply"
              />
            )}
            {progress && <CircularProgressSmall />}
          </div>
          <div className="fax-detail__toolbar-logos">
            <i className="fa-solid fa-trash" onClick={handleDeleteFax} />
          </div>
        </div>
        <div className="fax-detail__content">
          <Fax fax={fax} section={section} />
        </div>
        {forwardVisible && (
          <FakeWindow
            title="NEW FAX"
            width={1300}
            height={700}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 700) / 2}
            color={"#94bae8"}
            setPopUpVisible={setForwardVisible}
          >
            <NewFax
              setNewVisible={setForwardVisible}
              initialAttachment={attachmentToForward}
            />
          </FakeWindow>
        )}
        {replyVisible && (
          <FakeWindow
            title="NEW FAX"
            width={1300}
            height={700}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 700) / 2}
            color={"#94bae8"}
            setPopUpVisible={setReplyVisible}
          >
            <NewFax
              setNewVisible={setReplyVisible}
              initialAttachment={attachmentToForward}
              initialRecipient={{ ToFaxNumber: currentCallerId }}
              reply={true}
            />
          </FakeWindow>
        )}
        {addToReportsVisible && (
          <FakeWindow
            title={`ADD TO PATIENT REPORTS`}
            width={1000}
            height={810}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 810) / 2}
            color="#94bae8"
            setPopUpVisible={setAddToReportsVisible}
          >
            <ReportsInboxForm
              setAddVisible={setAddToReportsVisible}
              initialAttachment={attachmentToForward}
              errMsgPost={errMsgPost}
              setErrMsgPost={setErrMsgPost}
            />
          </FakeWindow>
        )}
      </>
    )
  );
};

export default FaxDetail;
