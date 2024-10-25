import axios from "axios";
import { toast } from "react-toastify";
import { AttachmentType, ReportFormType } from "../../types/api";
import { getExtension } from "./getExtension";

export const handleUploadReport = async (
  e: React.ChangeEvent<HTMLInputElement>,
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>,
  setIsLoadingFile: React.Dispatch<React.SetStateAction<boolean>>,
  formDatas: ReportFormType,
  setFormDatas: React.Dispatch<React.SetStateAction<ReportFormType>>
) => {
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
    setFormDatas({
      ...formDatas,
      File: fileToUpload,
      FileExtensionAndVersion: getExtension(fileToUpload.path),
      Content: { TextContent: "", Media: "" },
    });
    setIsLoadingFile(false);
    toast.success("File uploaded successfully!");
  } catch (err) {
    setIsLoadingFile(false);
    if (err instanceof Error) {
      toast.error(`Error unable to load document: ${err.message}`, {
        containerId: "A",
      });
    }
  }
};
