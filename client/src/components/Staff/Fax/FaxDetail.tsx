import { useMediaQuery } from "@mui/material";
import uniqueId from "lodash/uniqueId";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import useUserContext from "../../../hooks/context/useUserContext";
import { useFaxDelete } from "../../../hooks/reactquery/mutations/faxMutations";
import { useFax } from "../../../hooks/reactquery/queries/faxQueries";
import {
  AttachmentType,
  FaxToDeleteType,
  MessageAttachmentType,
} from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import Button from "../../UI/Buttons/Button";
import { confirmAlert } from "../../UI/Confirm/ConfirmGlobal";
import ArrowLeftIcon from "../../UI/Icons/ArrowLeftIcon";
import TrashIcon from "../../UI/Icons/TrashIcon";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import CircularProgressSmall from "../../UI/Progress/CircularProgressSmall";
import FakeWindow from "../../UI/Windows/FakeWindow";
import ReportInboxForm from "../ReportsInbox/ReportInboxForm";
import Fax from "./Fax";
import NewFax from "./NewFax";
import NewFaxMobile from "./NewFaxMobile";

type FaxDetailProps = {
  setCurrentFaxId: React.Dispatch<React.SetStateAction<string>>;
  currentFaxId: string;
  currentCallerId: string;
  section: string;
};

const FaxDetail = ({
  setCurrentFaxId,
  currentFaxId,
  currentCallerId,
  section,
}: FaxDetailProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [forwardVisible, setForwardVisible] = useState(false);
  const [addToReportsVisible, setAddToReportsVisible] = useState(false);
  const [replyVisible, setReplyVisible] = useState(false);
  const [attachmentToForward, setAttachmentToForward] = useState<
    Partial<MessageAttachmentType> | undefined
  >(undefined);
  const [progress, setProgress] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
  //Queries
  const {
    data: fax,
    isPending,
    error,
  } = useFax(currentFaxId, section === "Received faxes" ? "IN" : "OUT");
  const faxDelete = useFaxDelete();

  const handleClickBack = () => {
    setCurrentFaxId("");
  };

  const handleDeleteFax = async () => {
    if (
      await confirmAlert({
        content: `Do you really want to delete this fax ? (this action is irreversible)`,
      })
    ) {
      const faxToDelete: FaxToDeleteType = {
        faxFileName: currentFaxId,
        direction: section === "Received faxes" ? "IN" : "OUT",
      };
      faxDelete.mutate(faxToDelete, {
        onSuccess: () => {
          setCurrentFaxId("");
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
    try {
      const response: AttachmentType = await xanoPost(
        "/upload/attachment",
        "staff",
        {
          content: "data:application/pdf;base64," + fax,
        }
      );
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
    } catch (err) {
      setProgress(false);
      if (err instanceof Error)
        toast.error(`Unable to forward fax: ${err.message}`, {
          containerId: "A",
        });
    }
  };

  const handleAddToReports = async () => {
    setProgress(true);
    try {
      const response: AttachmentType = await xanoPost(
        "/upload/attachment",
        "staff",
        {
          content: "data:application/pdf;base64," + fax,
        }
      );
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
    } catch (err) {
      setProgress(false);
      if (err instanceof Error)
        toast.error(`Unable to add fax to reports: ${err.message}`, {
          containerId: "A",
        });
    }
  };

  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;

  return (
    fax && (
      <>
        <div className="fax__detail-toolbar">
          <ArrowLeftIcon onClick={handleClickBack} mr={20} />
          <div className="fax__detail-toolbar-btns">
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
          <div className="fax__detail-toolbar-logos">
            <TrashIcon onClick={handleDeleteFax} />
          </div>
        </div>
        <div className="fax__detail-content">
          <Fax faxURL={fax} />
        </div>
        {forwardVisible && (
          <FakeWindow
            title="NEW FAX"
            width={1000}
            height={700}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 700) / 2}
            color={"#94bae8"}
            setPopUpVisible={setForwardVisible}
          >
            {isTabletOrMobile ? (
              <NewFaxMobile
                setNewVisible={setForwardVisible}
                initialAttachment={attachmentToForward}
              />
            ) : (
              <NewFax
                setNewVisible={setForwardVisible}
                initialAttachment={attachmentToForward}
              />
            )}
          </FakeWindow>
        )}
        {replyVisible && (
          <FakeWindow
            title="NEW FAX"
            width={1000}
            height={700}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 700) / 2}
            color={"#94bae8"}
            setPopUpVisible={setReplyVisible}
          >
            {isTabletOrMobile ? (
              <NewFaxMobile
                setNewVisible={setReplyVisible}
                initialAttachment={attachmentToForward}
                initialRecipient={{ ToFaxNumber: currentCallerId }}
                reply={true}
              />
            ) : (
              <NewFax
                setNewVisible={setReplyVisible}
                initialAttachment={attachmentToForward}
                initialRecipient={{ ToFaxNumber: currentCallerId }}
                reply={true}
              />
            )}
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
            <ReportInboxForm
              setAddVisible={setAddToReportsVisible}
              initialAttachment={attachmentToForward as MessageAttachmentType}
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
