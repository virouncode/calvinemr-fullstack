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
import Patients from "../Patients";
import StaffContacts from "../StaffContacts";
import MessagesAttachments from "./MessagesAttachments";
import MessagesTemplates from "./MessagesTemplates";

const NewMessage = ({
  setNewVisible,
  initialPatient = { id: 0, name: "" },
  initialAttachments = [],
  initialBody = null,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [attachments, setAttachments] = useState(initialAttachments);
  const [recipientsIds, setRecipientsIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(initialBody || "");
  const [important, setImportant] = useState(false);
  const [patient, setPatient] = useState(initialPatient);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [templatesVisible, setTemplatesVisible] = useState(false);
  const textareaRef = useRef(null);
  const messagePost = useMessagePost(user.id, "Received messages");

  const handleChange = (e) => {
    setBody(e.target.value);
  };

  const handleChangeSubject = (e) => {
    setSubject(e.target.value);
  };

  const isContactChecked = (id) => recipientsIds.includes(id);
  const isCategoryChecked = (category) => categories.includes(category);
  const isPatientChecked = (id) => {
    return patient.id === id ? true : false;
  };

  const handleSelectTemplate = (e, template) => {
    if (template.to_staff_ids.length) setRecipientsIds(template.to_staff_ids);
    if (template.subject) setSubject(template.subject);
    setBody((b) =>
      b ? b + "\n\n" + template.body + "\n" : template.body + "\n"
    );
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(
      textareaRef.current.value.length,
      textareaRef.current.value.length
    );
  };

  const handleCheckPatient = (e) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    const name = e.target.name;
    if (checked) {
      setPatient({ id, name });
    } else {
      setPatient({ id: 0, name: "" });
    }
  };

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

  const handleImportanceChange = (e) => {
    const value = e.target.checked;
    setImportant(value);
  };

  const handleCancel = () => {
    setNewVisible(false);
  };

  const handleRemoveAttachment = (fileName) => {
    let updatedAttachments = [...attachments];
    updatedAttachments = updatedAttachments.filter(
      (attachment) => attachment.file.name !== fileName
    );
    setAttachments(updatedAttachments);
  };

  const handleSend = async () => {
    if (!recipientsIds.length) {
      toast.error("Please choose at least one recipient", { containerId: "A" });
      return;
    }
    setProgress(true);
    let attach_ids = [];
    if (attachments.length > 0) {
      attach_ids = await xanoPost("/messages_attachments", "staff", {
        attachments_array: attachments,
      });
    }
    const messageToPost = {
      from_id: user.id,
      to_staff_ids: recipientsIds,
      subject: subject,
      body: body,
      attachments_ids: attach_ids,
      related_patient_id: patient.id,
      read_by_staff_ids: [user.id],
      date_created: nowTZTimestamp(),
      high_importance: important,
    };
    messagePost.mutate(messageToPost, {
      onSuccess: () => {
        setProgress(false);
        setNewVisible(false);
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
          const response = await xanoPost("/upload/attachment", "staff", {
            content,
          });
          if (!response.type) response.type = "document";
          setAttachments([
            ...attachments,
            {
              file: response,
              alias: file.name,
              date_created: nowTZTimestamp(),
              created_by_id: user.id,
              created_by_user_type: "staff",
              id: uniqueId("messages_attachment_"),
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

  return (
    <div className="new-message">
      <div className="new-message__contacts">
        <StaffContacts
          staffInfos={staffInfos}
          handleCheckContact={handleCheckContact}
          isContactChecked={isContactChecked}
          handleCheckCategory={handleCheckCategory}
          isCategoryChecked={isCategoryChecked}
        />
      </div>
      <div className="new-message__form">
        <div className="new-message__recipients">
          <strong>To: </strong>
          <input
            type="text"
            placeholder="Recipient(s)"
            value={staffInfos
              .filter(({ id }) => recipientsIds.includes(id))
              .map((staff) => staffIdToTitleAndName(staffInfos, staff.id))
              .join(" / ")}
            readOnly
          />
        </div>
        <div className="new-message__subject">
          <strong>Subject: </strong>
          <input
            type="text"
            placeholder="Subject"
            onChange={handleChangeSubject}
            value={subject}
          />
        </div>
        <div className="new-message__patient">
          <strong>About patient: </strong>
          <input
            type="text"
            placeholder="Patient"
            value={patient.name}
            readOnly
          />
        </div>
        <div className="new-message__attach">
          <strong>Attach files</strong>
          <i
            className="fa-solid fa-paperclip"
            onClick={handleAttach}
            disabled={progress || isLoadingFile}
          ></i>
          {attachments.map((attachment) => (
            <span key={attachment.file.name} style={{ marginLeft: "5px" }}>
              {attachment.alias},
            </span>
          ))}
        </div>
        <div className="new-message__importance">
          <div className="new-message__importance-check">
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
        <div className="new-message__body">
          <textarea
            value={body}
            onChange={handleChange}
            autoFocus
            ref={textareaRef}
          />
          <MessagesAttachments
            attachments={attachments}
            handleRemoveAttachment={handleRemoveAttachment}
            deletable={true}
            addable={false}
          />
        </div>
        <div className="new-message__btns">
          <SaveButton
            onClick={handleSend}
            disabled={isLoadingFile || progress}
            label="Send"
          />
          <CancelButton onClick={handleCancel} disabled={progress} />
          {isLoadingFile && <CircularProgressMedium />}
        </div>
      </div>
      <div className="new-message__patients">
        <Patients
          handleCheckPatient={handleCheckPatient}
          isPatientChecked={isPatientChecked}
          msgType="Internal"
        />
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
          <MessagesTemplates handleSelectTemplate={handleSelectTemplate} />
        </FakeWindow>
      )}
    </div>
  );
};

export default NewMessage;
