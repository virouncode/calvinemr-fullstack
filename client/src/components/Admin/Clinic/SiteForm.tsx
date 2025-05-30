import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import useUserContext from "../../../hooks/context/useUserContext";
import { useSitesPost } from "../../../hooks/reactquery/mutations/sitesMutations";
import {
  AdminType,
  AttachmentType,
  SiteFormType,
  SiteType,
} from "../../../types/api";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { initialSite } from "../../../utils/initialDatas/initialDatas";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { siteSchema } from "../../../validation/clinic/siteValidation";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import FormSite from "./FormSite";

type SiteFormProps = {
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const SiteForm = ({ setAddVisible }: SiteFormProps) => {
  //Hooks
  const { user } = useUserContext() as { user: AdminType };
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [formDatas, setFormDatas] = useState<SiteFormType | SiteType>(
    initialSite
  );
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [progress, setProgress] = useState(false);
  //Queries
  const sitePost = useSitesPost();

  const handleCancel = () => {
    setAddVisible(false);
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrMsg("");
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
      setFormDatas({ ...formDatas, logo: fileToUpload ?? null });
      setIsLoadingFile(false);
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error unable to load file: ${err.message}`, {
          containerId: "A",
        });
      setIsLoadingFile(false);
    }
  };

  const handleChangePostalOrZip = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setErrMsg("");
    setPostalOrZip(e.target.value);
    setFormDatas({
      ...formDatas,
      postal_code: "",
      zip_code: "",
    });
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    if (name === "postalZipCode") {
      if (postalOrZip === "postal") {
        setFormDatas({ ...formDatas, postal_code: value, zip_code: "" });
        return;
      } else {
        setFormDatas({ ...formDatas, zip_code: value, postal_code: "" });
        return;
      }
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async () => {
    //Formatting
    const siteToPost: Partial<SiteType> = {
      ...formDatas,
      name: firstLetterUpper(formDatas.name),
      address: firstLetterUpper(formDatas.address),
      city: firstLetterUpper(formDatas.city),
      rooms: [
        ...formDatas.rooms.map((room) => {
          return { id: room.id, title: firstLetterUpper(room.title) };
        }),
        { id: "z", title: "TBD" },
      ],
      created_by_id: user.id,
      date_created: nowTZTimestamp(),
    };
    //Validation
    if (formDatas?.rooms?.length === 0) {
      setErrMsg("Please add at least one room for the appointments");
      return;
    }
    if (formDatas?.rooms?.find((room) => !room.title)) {
      setErrMsg("All rooms must have a Name");
      return;
    }

    try {
      await siteSchema.validate(siteToPost);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    setProgress(true);
    sitePost.mutate(siteToPost, {
      onSuccess: () => {
        setAddVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  return (
    <div
      className="site-form__container"
      style={{ border: errMsg && "solid 1.5px red" }}
    >
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <FormSite
        formDatas={formDatas}
        setFormDatas={setFormDatas}
        handleChange={handleChange}
        postalOrZip={postalOrZip}
        handleChangePostalOrZip={handleChangePostalOrZip}
        handleLogoChange={handleLogoChange}
        isLoadingFile={isLoadingFile}
        setErrMsg={setErrMsg}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        progress={progress}
      />
    </div>
  );
};

export default SiteForm;
