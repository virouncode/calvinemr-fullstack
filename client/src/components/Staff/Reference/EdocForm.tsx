import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../hooks/context/useUserContext";
import { useEdocPost } from "../../../hooks/reactquery/mutations/edocsMutations";
import { AttachmentType, EdocFormType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { edocSchema } from "../../../validation/reference/edocValidation";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import ReportViewer from "../../UI/Documents/ReportViewer";
import Input from "../../UI/Inputs/Input";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import CircularProgressSmall from "../../UI/Progress/CircularProgressSmall";

type EdocFormProps = {
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const EdocForm = ({ setAddVisible }: EdocFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [formDatas, setFormDatas] = useState<EdocFormType>({
    date_created: nowTZTimestamp(),
    created_by_id: user.id,
    file: null,
    notes: "",
    name: "",
  });
  const [errMsgPost, setErrMsgPost] = useState("");
  const edocPost = useEdocPost();

  const handleSubmit = async () => {
    setErrMsgPost("");
    //Formatting
    const datasToPost: EdocFormType = {
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
      },
      onSettled: () => {
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
    setErrMsgPost("");
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrMsgPost("");
    if (file.size > 128000000) {
      toast.error("The file is over 128Mb, please choose another file", {
        containerId: "A",
      });
      return;
    }

    setIsLoadingFile(true);
    const formData = new FormData();
    formData.append("content", file);
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
  return (
    <div className="reference__edocs-form">
      <div className="reference__edocs-form-content">
        {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
        <div className="reference__edocs-form-btn-container">
          <SaveButton
            label="Save"
            disabled={isLoadingFile || progress}
            onClick={handleSubmit}
          />
          <CancelButton onClick={handleCancel} />
          {isLoadingFile && <CircularProgressSmall />}
        </div>
        <div className="reference__edocs-form-row">
          <Input
            label="Name"
            value={formDatas.name}
            onChange={handleChange}
            name="name"
            id="name"
          />
        </div>
        <div className="reference__edocs-form-row">
          <label>File</label>
          <input
            name="Content"
            type="file"
            onChange={handleUpload}
            accept=".jpeg, .jpg, .png, .pdf"
            // .jpeg, .jpg, .png, .gif, .tif, , .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx"
          />
        </div>
        <div className="reference__edocs-form-row">
          <label htmlFor="notes">Notes</label>
          <textarea
            name="notes"
            value={formDatas.notes}
            onChange={handleChange}
            autoComplete="off"
            id="notes"
          />
        </div>
      </div>
      {formDatas.file && (
        <div className="reference__edocs-form-preview">
          <ReportViewer file={formDatas.file} />
        </div>
      )}
    </div>
  );
};

export default EdocForm;
