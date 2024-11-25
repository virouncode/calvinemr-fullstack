import { UseMutationResult } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  AttachmentType,
  ConsentFormFormType,
  ConsentFormType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import Input from "../../../../UI/Inputs/Input";
import FormSignCell from "../../../../UI/Tables/FormSignCell";

type ConsentFormProps = {
  editCounter: React.MutableRefObject<number>;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  topicPost: UseMutationResult<
    ConsentFormType,
    Error,
    Partial<ConsentFormType>,
    void
  >;
  isLoadingFile: boolean;
  setIsLoadingFile: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConsentForm = ({
  editCounter,
  setAddVisible,
  setErrMsgPost,
  errMsgPost,
  topicPost,
  patientId,
  isLoadingFile,
  setIsLoadingFile,
}: ConsentFormProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const [formDatas, setFormDatas] = useState<ConsentFormFormType>({
    patient_id: patientId,
    date_created: nowTZTimestamp(),
    created_by_id: user.id,
    name: "",
    file: null,
  });
  const [progress, setProgress] = useState(false);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    setFormDatas({
      ...formDatas,
      name: e.target.value,
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
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

  const handleSubmit = async () => {
    setErrMsgPost("");
    //Validation
    if (formDatas.name === "") {
      setErrMsgPost("Name field is required");
      return;
    }
    if (!formDatas.file) {
      setErrMsgPost("Please upload a file");
      return;
    }
    const topicToPost: Partial<ConsentFormType> = {
      ...formDatas,
      date_created: nowTZTimestamp(),
      file: formDatas.file as AttachmentType,
    };
    //Submission
    setProgress(true);
    topicPost.mutate(topicToPost, {
      onSuccess: () => {
        editCounter.current -= 1;
        setAddVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };
  const handleCancel = () => {
    setErrMsgPost("");
    setAddVisible(false);
  };
  return (
    <tr
      className="consentforms__form"
      style={{
        border: errMsgPost && "1.5px solid red",
      }}
    >
      <td>
        <div className="consentforms__form-btn-container">
          <SaveButton onClick={handleSubmit} disabled={progress} />
          <CancelButton onClick={handleCancel} disabled={progress} />
        </div>
      </td>
      <td>
        <Input
          value={formDatas.name}
          name="name"
          id="name"
          onChange={handleChangeName}
        />
      </td>
      <td>
        <input
          name="file"
          type="file"
          onChange={handleUpload}
          accept=".jpeg, .jpg, .png, .pdf"
        />
      </td>
      <FormSignCell />
    </tr>
  );
};

export default ConsentForm;
