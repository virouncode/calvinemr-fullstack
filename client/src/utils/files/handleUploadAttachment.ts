import axios from "axios";
import { uniqueId } from "lodash";
import { toast } from "react-toastify";
import { AttachmentType, MessageAttachmentType } from "../../types/api";
import { UserPatientType, UserStaffType } from "../../types/app";
import { nowTZTimestamp } from "../dates/formatDates";

export const handleUploadAttachment = (
  setIsLoadingFile: React.Dispatch<React.SetStateAction<boolean>>,
  attachments: Partial<MessageAttachmentType>[],
  setAttachments: React.Dispatch<
    React.SetStateAction<Partial<MessageAttachmentType>[]>
  >,
  user: UserStaffType | UserPatientType,
  uniqueIdPrefix: string
) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".jpeg, .jpg, .png, .pdf";

  input.onchange = async (event) => {
    const e = event as unknown as React.ChangeEvent<HTMLInputElement>;
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 128000000) {
      toast.error(
        "The file is over 128Mb, please choose another file or send a link",
        {
          containerId: "A",
        }
      );
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
      setAttachments([
        ...attachments,
        {
          file: fileToUpload,
          alias: file?.name,
          date_created: nowTZTimestamp(),
          created_by_id: user.id,
          created_by_user_type: "patient",
          id: uniqueId(`${uniqueIdPrefix}`),
        },
      ]); //meta, mime, name, path, size, type
      setIsLoadingFile(false);
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to load file: ${err.message}`, {
          containerId: "A",
        });
      setIsLoadingFile(false);
    }
  };
  input.click();
};
