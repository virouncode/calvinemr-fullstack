import { useMediaQuery } from "@mui/material";
import axios from "axios";
import uniqueId from "lodash/uniqueId";
import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useFaxDelete,
  useFaxNotesDelete,
} from "../../../hooks/reactquery/mutations/faxMutations";
import { useFax } from "../../../hooks/reactquery/queries/faxQueries";
import {
  AttachmentType,
  FaxNotesType,
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
    data: faxBase64,
    isPending,
    error,
  } = useFax(currentFaxId, section === "Received faxes" ? "IN" : "OUT");
  const faxDelete = useFaxDelete();
  const faxNotesDelete = useFaxNotesDelete();

  const handleClickBack = () => {
    setCurrentFaxId("");
  };

  const handleDeleteFax = async () => {
    if (
      await confirmAlert({
        content: `Do you really want to delete this fax ? (this action is irreversible)`,
      })
    ) {
      //Delete fax notes
      try {
        const faxNotesToDelete: FaxNotesType = await xanoGet(
          "/faxnotes_for_filename",
          "staff",
          {
            file_name: currentFaxId,
          }
        );
        if (faxNotesToDelete) {
          faxNotesDelete.mutate(faxNotesToDelete.id, {
            onError: (err) => {
              toast.error(`Unable to delete fax notes: ${err}`, {
                containerId: "A",
              });
            },
          });
        }
      } catch (err) {
        if (err instanceof Error)
          toast.error(`Unable to delete fax notes: ${err.message}`, {
            containerId: "A",
          });
        return;
      }
      //Delete fax
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
    const formData = new FormData();
    formData.append("content", "data:application/pdf;base64," + faxBase64);
    try {
      const response = await axios.post(
        import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const fileToUpload: AttachmentType = response.data;
      setAttachmentToForward({
        file: fileToUpload,
        alias: "initial_fax.pdf",
        date_created: nowTZTimestamp(),
        created_by_id: user.id,
        created_by_user_type: "staff",
        id: uniqueId("messages_attachment_"),
      });
      setProgress(false);
      setReplyVisible(true);
    } catch (err) {
      setProgress(false);
      if (err instanceof Error)
        toast.error(`Unable to reply fax: ${err.message}`, {
          containerId: "A",
        });
    }
  };

  const handleClickForward = async () => {
    setProgress(true);
    const formData = new FormData();
    formData.append("content", "data:application/pdf;base64," + faxBase64);
    try {
      const response = await axios.post(
        import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const fileToUpload: AttachmentType = response.data;
      setAttachmentToForward({
        file: fileToUpload,
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
    const formData = new FormData();
    formData.append("content", "data:application/pdf;base64," + faxBase64);
    try {
      const response = await axios.post(
        import.meta.env.VITE_XANO_UPLOAD_ATTACHMENT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const fileToUpload: AttachmentType = response.data;
      setAttachmentToForward({
        file: fileToUpload,
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
    faxBase64 && (
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
          {import.meta.env.VITE_ISDEMO === "false" && (
            <div className="fax__detail-toolbar-logos">
              <TrashIcon onClick={handleDeleteFax} />
            </div>
          )}
        </div>
        <div className="fax__detail-content">
          <Fax faxBase64={faxBase64} />
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
                initialAttachments={
                  attachmentToForward ? [attachmentToForward] : []
                }
              />
            ) : (
              <NewFax
                setNewVisible={setForwardVisible}
                initialAttachments={
                  attachmentToForward ? [attachmentToForward] : []
                }
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
                initialAttachments={
                  attachmentToForward ? [attachmentToForward] : []
                }
                initialRecipient={{ ToFaxNumber: currentCallerId }}
                reply={true}
              />
            ) : (
              <NewFax
                setNewVisible={setReplyVisible}
                initialAttachments={
                  attachmentToForward ? [attachmentToForward] : []
                }
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
