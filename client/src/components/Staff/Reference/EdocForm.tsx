import React, { useState } from "react";
import { toast } from "react-toastify";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import useUserContext from "../../../hooks/context/useUserContext";
import { useEdocPost } from "../../../hooks/reactquery/mutations/edocsMutations";
import { AttachmentType, EdocType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { edocSchema } from "../../../validation/reference/edocValidation";
import CancelButton from "../../UI/Buttons/CancelButton";
import SubmitButton from "../../UI/Buttons/SubmitButton";
import ReportViewer from "../../UI/Documents/ReportViewer";
import Input from "../../UI/Inputs/Input";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";

type EdocFormProps = {
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const EdocForm = ({
  errMsgPost,
  setErrMsgPost,
  setAddVisible,
}: EdocFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [formDatas, setFormDatas] = useState<Partial<EdocType>>({
    name: "",
    file: null,
    created_by_id: user.id,
    notes: "",
  });
  const edocPost = useEdocPost();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMsgPost("");
    //Formatting
    const datasToPost: Partial<EdocType> = {
      ...formDatas,
      date_created: nowTZTimestamp(),
    };
    //Validation
    try {
      await edocSchema.validate(datasToPost);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    if (!datasToPost.file) {
      setErrMsgPost("Please upload a file");
      return;
    }
    setProgress(true);
    edocPost.mutate(datasToPost, {
      onSuccess: () => {
        setAddVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };
  const handleCancel = () => {
    setAddVisible(false);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrMsgPost("");
    setIsLoadingFile(true);
    if (file.size > 25000000) {
      setErrMsgPost("The file is over 25Mb, please choose another file");
      setIsLoadingFile(false);
      return;
    }
    // setting up the reader
    setIsLoadingFile(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      const content = e.target?.result; // this is the content!
      try {
        const fileToUpload: AttachmentType = await xanoPost(
          "/upload/attachment",
          "staff",
          {
            content,
          }
        );
        setIsLoadingFile(false);
        setFormDatas({
          ...formDatas,
          file: fileToUpload,
        });
      } catch (err) {
        setIsLoadingFile(false);
        if (err instanceof Error)
          toast.error(`Error unable to load document: ${err.message}`, {
            containerId: "A",
          });
      }
    };
  };
  return (
    <div
      className="reference-edocs__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <form className="reference-edocs__content" onSubmit={handleSubmit}>
        {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
        <div className="reference-edocs__form-btn-container">
          <SubmitButton label="Save" disabled={isLoadingFile || progress} />
          <CancelButton onClick={handleCancel} />
        </div>
        <div className="reference-edocs__row">
          <Input
            label="Name"
            value={formDatas?.name ?? ""}
            onChange={handleChange}
            name="name"
            id="name"
          />
        </div>
        <div className="reference-edocs__row">
          <label>File</label>
          <input
            name="Content"
            type="file"
            onChange={handleUpload}
            accept=".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg"
            // .jpeg, .jpg, .png, .gif, .tif, , .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx"
          />
        </div>
        <div className="reference-edocs__row reference-edocs__row--text">
          <label htmlFor="notes">Notes</label>
          <textarea
            name="notes"
            value={formDatas.notes || ""}
            onChange={handleChange}
            autoComplete="off"
            id="notes"
          />
        </div>
      </form>
      {formDatas.file && (
        <div className="reference-edocs__preview">
          {isLoadingFile && <LoadingParagraph />}
          <ReportViewer file={formDatas.file} />
        </div>
      )}
    </div>
  );
};

export default EdocForm;
