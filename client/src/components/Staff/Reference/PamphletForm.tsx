import { useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../hooks/context/useUserContext";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";

import axios from "axios";
import React from "react";
import { usePamphletPost } from "../../../hooks/reactquery/mutations/pamphletsMutations";
import { AttachmentType, PamphletFormType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { pamphletSchema } from "../../../validation/reference/pamphletValidation";
import CancelButton from "../../UI/Buttons/CancelButton";
import SubmitButton from "../../UI/Buttons/SubmitButton";
import ReportViewer from "../../UI/Documents/ReportViewer";
import Input from "../../UI/Inputs/Input";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import CircularProgressSmall from "../../UI/Progress/CircularProgressSmall";

type PamphletFormProps = {
  errMsgPost: string;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const PamphletForm = ({
  errMsgPost,
  setErrMsgPost,
  setAddVisible,
}: PamphletFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [formDatas, setFormDatas] = useState<PamphletFormType>({
    date_created: nowTZTimestamp(),
    created_by_id: user.id,
    file: null,
    notes: "",
    name: "",
  });
  const pamphletPost = usePamphletPost();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMsgPost("");
    //Formatting
    if (!formDatas.file) {
      setErrMsgPost("Please upload a file");
      return;
    }
    const datasToPost: PamphletFormType = {
      ...formDatas,
      date_created: nowTZTimestamp(),
    };
    //Validation
    try {
      await pamphletSchema.validate(datasToPost);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    if (!datasToPost.file) {
      setErrMsgPost("Please upload a file");
      return;
    }
    setProgress(true);
    pamphletPost.mutate(datasToPost, {
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
    <div
      className="reference__edocs-form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <form className="reference__edocs-form-content" onSubmit={handleSubmit}>
        {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
        <div className="reference__edocs-form-btn-container">
          <SubmitButton label="Save" disabled={isLoadingFile || progress} />
          <CancelButton onClick={handleCancel} />
          {isLoadingFile && <CircularProgressSmall />}
        </div>
        <div className="reference__edocs-form-row">
          <Input
            label="Name"
            value={formDatas?.name ?? ""}
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
            // ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx"
          />
        </div>
        <div className="reference__edocs-form-row reference__edocs__row--text">
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
        <div className="reference__edocs-form-preview">
          <ReportViewer file={formDatas.file} />
        </div>
      )}
    </div>
  );
};

export default PamphletForm;
