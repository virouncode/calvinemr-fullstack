import { uniqueId } from "lodash";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { useMessagePost } from "../../../../hooks/reactquery/mutations/messagesMutations";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { categoryToTitle } from "../../../../utils/names/categoryToTitle";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SaveButton from "../../../UI/Buttons/SaveButton";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessagesAttachments from "../Internal/MessagesAttachments";
import StaffContacts from "../StaffContacts";
import MessageExternal from "./MessageExternal";
import MessagesExternalTemplates from "./MessagesExternalTemplates";

const ForwardMessageExternal = ({
  setForwardVisible,
  message,
  previousMsgs,
  patientName,
  section,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [attachments, setAttachments] = useState([]);
  const [recipientsIds, setRecipientsIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [body, setBody] = useState("");
  const [important, setImportant] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const textareaRef = useRef(null);
  const messagePost = useMessagePost(user.id, section);

  const handleChange = (e) => {
    setBody(e.target.value);
  };
  const handleImportanceChange = (e) => {
    const value = e.target.checked;
    setImportant(value);
  };

  const isContactChecked = (id) => recipientsIds.includes(id);
  const isCategoryChecked = (category) => categories.includes(category);

  const handleCheckContact = (e) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    const category = e.target.name;
    const categoryContactsIds = staffInfos
      .filter(({ title }) => title === categoryToTitle(category))
      .map(({ id }) => id);

    if (checked) {
      let recipientsIdsUpdated = [...recipientsIds, id];
      setRecipientsIds(recipientsIdsUpdated);
      if (
        categoryContactsIds.every((id) => recipientsIdsUpdated.includes(id))
      ) {
        setCategories([...categories, category]);
      }
    } else {
      let recipientsIdsUpdated = [...recipientsIds];
      recipientsIdsUpdated = recipientsIdsUpdated.filter(
        (recipientId) => recipientId !== id
      );
      setRecipientsIds(recipientsIdsUpdated);
      if (categories.includes(category)) {
        let categoriesUpdated = [...categories];
        categoriesUpdated = categoriesUpdated.filter(
          (categoryName) => categoryName !== category
        );
        setCategories(categoriesUpdated);
      }
    }
  };

  const handleSelectTemplate = (e, template) => {
    setBody((b) =>
      b ? b + "\n\n" + template.body + "\n" : template.body + "\n"
    );
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(
      textareaRef.current.value.length,
      textareaRef.current.value.length
    );
  };

  const handleCheckCategory = (e) => {
    const category = e.target.id;
    const checked = e.target.checked;
    const categoryContactsIds = staffInfos
      .filter(({ title }) => title === categoryToTitle(category))
      .map(({ id }) => id);

    if (checked) {
      setCategories([...categories, category]);
      //All contacts of category

      let recipientsIdsUpdated = [...recipientsIds];
      categoryContactsIds.forEach((id) => {
        if (!recipientsIdsUpdated.includes(id)) {
          recipientsIdsUpdated.push(id);
        }
      });
      setRecipientsIds(recipientsIdsUpdated);
    } else {
      let categoriesUpdated = [...categories];
      categoriesUpdated = categoriesUpdated.filter((name) => name !== category);
      setCategories(categoriesUpdated);

      let recipientsIdsUpdated = [...recipientsIds];
      recipientsIdsUpdated = recipientsIdsUpdated.filter(
        (id) => !categoryContactsIds.includes(id)
      );
      setRecipientsIds(recipientsIdsUpdated);
    }
  };

  const handleCancel = () => {
    setForwardVisible(false);
  };

  const handleSend = async () => {
    if (!recipientsIds.length) {
      toast.error("Please choose at least one recipient", { containerId: "A" });
      return;
    }
    setProgress(true);
    let attach_ids;
    if (attachments.length > 0) {
      const response = await xanoPost(
        "/messages_attachments",
        "staff",

        { attachments_array: attachments }
      );
      attach_ids = [
        ...message.attachments_ids.map(({ attachment }) => attachment.id),
        ...response,
      ];
    } else {
      attach_ids = [
        ...message.attachments_ids.map(({ attachment }) => attachment.id),
      ];
    }
    //create the message
    const messageToPost = {
      from_id: user.id,
      to_staff_ids: recipientsIds,
      subject: previousMsgs.length
        ? `Fwd: ${message.subject.slice(message.subject.indexOf(":") + 1)}`
        : `Fwd: ${message.subject}`,
      body: body,
      attachments_ids: attach_ids,
      // related_patient_id: message.from_patient_id || message.to_patient_id,
      related_patient_id: message.from_patient_id,
      read_by_staff_ids: [user.id],
      previous_messages: [
        ...message.previous_messages_ids.map(({ previous_message }) => {
          return { message_type: "External", id: previous_message.id };
        }),
        { message_type: "External", id: message.id },
      ],
      date_created: nowTZTimestamp(),
      type: "Internal", //back to internal !!!
      high_importance: important,
    };
    messagePost.mutate(messageToPost, {
      onSuccess: () => {
        setForwardVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
    for (const to_staff_id of messageToPost.to_staff_ids) {
      if (to_staff_id !== user.id) {
        socket.emit("message", {
          route: "UNREAD",
          action: "update",
          content: {
            userId: to_staff_id,
          },
        });
      }
    }
  };

  const handleAttach = (e) => {
    let input = e.nativeEvent.view.document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpeg, .jpg, .png, .gif, .tif, .pdf, .svg";
    // ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx";
    input.onchange = (e) => {
      // getting a hold of the file reference
      let file = e.target.files[0];
      if (file.size > 25000000) {
        toast.error(
          "The file is over 25Mb, please choose another one or send a link",
          { containerId: "A" }
        );
        return;
      }
      setIsLoadingFile(true);
      // setting up the reader`
      let reader = new FileReader();
      reader.readAsDataURL(file);
      // here we tell the reader what to do when it's done reading...
      reader.onload = async (e) => {
        let content = e.target.result; // this is the content!
        try {
          const response = await xanoPost(
            "/upload/attachment",
            "staff",

            { content }
          );
          if (!response.type) response.type = "document";
          setAttachments([
            ...attachments,
            {
              file: response,
              alias: file.name,
              date_created: nowTZTimestamp(),
              created_by_id: user.id,
              created_by_user_type: "staff",
              id: uniqueId("messages_external_attachment_"),
            },
          ]); //meta, mime, name, path, size, type
          setIsLoadingFile(false);
        } catch (err) {
          toast.error(`Error: unable to load file: ${err.message}`, {
            containerId: "A",
          });
          setIsLoadingFile(false);
        }
      };
    };
    input.click();
  };

  const handleRemoveAttachment = (fileName) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file.name !== fileName
    );
    setAttachments(updatedAttachments);
  };

  return (
    <div className="forward-message">
      <div className="forward-message__contacts">
        <StaffContacts
          staffInfos={staffInfos}
          handleCheckContact={handleCheckContact}
          isContactChecked={isContactChecked}
          handleCheckCategory={handleCheckCategory}
          isCategoryChecked={isCategoryChecked}
        />
      </div>
      <div className="forward-message__form">
        <div className="forward-message__recipients">
          <strong>To: </strong>
          <input
            type="text"
            placeholder="Recipients"
            value={staffInfos
              .filter(({ id }) => recipientsIds.includes(id))
              .map((staff) => staffIdToTitleAndName(staffInfos, staff.id))
              .join(" / ")}
            readOnly
          />
        </div>
        <div className="forward-message__subject">
          <strong>Subject:</strong>
          {previousMsgs.length
            ? `\u00A0Fwd: ${message.subject.slice(
                message.subject.indexOf(":") + 1
              )}`
            : `\u00A0Fwd: ${message.subject}`}
        </div>
        {patientName && (
          <div className="forward-message__patient">
            <strong>About patient: {"\u00A0"}</strong> {patientName}
          </div>
        )}
        <div className="forward-message__attach">
          <strong>Attach files</strong>
          <i className="fa-solid fa-paperclip" onClick={handleAttach}></i>
          {attachments.map((attachment) => (
            <span key={attachment.file.name} style={{ marginLeft: "5px" }}>
              {attachment.alias},
            </span>
          ))}
        </div>
        <div className="forward-message__importance">
          <div className="forward-message__importance-check">
            <input
              type="checkbox"
              name="high_importance"
              id="importance"
              style={{ marginRight: "5px" }}
              onChange={handleImportanceChange}
              checked={important}
            />
            <label htmlFor="importance">High importance</label>
          </div>
          <div>
            <strong
              onClick={() => setTemplatesVisible((v) => !v)}
              style={{ textDecoration: "underline", cursor: "pointer" }}
            >
              Use Template
            </strong>
          </div>
        </div>
        <div className="forward-message__body">
          <textarea
            value={body}
            onChange={handleChange}
            ref={textareaRef}
            autoFocus
          />
          <div className="forward-message__history">
            <MessageExternal message={message} key={message.id} index={0} />
            {previousMsgs.map((message, index) => (
              <MessageExternal
                message={message}
                key={message.id}
                index={index + 1}
              />
            ))}
          </div>
          <MessagesAttachments
            attachments={attachments}
            handleRemoveAttachment={handleRemoveAttachment}
            deletable={true}
            cardWidth="30%"
            addable={false}
          />
        </div>
        <div className="forward-message__btns">
          <SaveButton
            onClick={handleSend}
            disabled={isLoadingFile || progress}
            label="Send"
          />
          <CancelButton onClick={handleCancel} disabled={progress} />
          {isLoadingFile && <CircularProgressMedium />}
        </div>
      </div>
      {templatesVisible && (
        <FakeWindow
          title={`CHOOSE MESSAGE TEMPLATE(S)`}
          width={800}
          height={600}
          x={window.innerWidth - 800}
          y={0}
          color="#93b5e9"
          setPopUpVisible={setTemplatesVisible}
        >
          <MessagesExternalTemplates
            handleSelectTemplate={handleSelectTemplate}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default ForwardMessageExternal;
