import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import useUserContext from "../../../hooks/context/useUserContext";
import { useSitesPut } from "../../../hooks/reactquery/mutations/sitesMutations";
import { AdminType, SiteFormType, SiteType } from "../../../types/api";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { siteSchema } from "../../../validation/clinic/siteValidation";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import FormSite from "./FormSite";

type SiteEditProps = {
  site: SiteType;
  editVisible: boolean;
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const SiteEdit = ({ site, editVisible, setEditVisible }: SiteEditProps) => {
  //Hooks
  const { user } = useUserContext() as { user: AdminType };
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [formDatas, setFormDatas] = useState<SiteType | SiteFormType>(site);
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [progress, setProgress] = useState(false);
  useEffect(() => {
    setFormDatas(site);
  }, [site]);
  //Queries
  const sitePut = useSitesPut();

  const handleChangePostalOrZip = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setErrMsg("");
    setPostalOrZip(e.target.value);
    setFormDatas({
      ...formDatas,
      postal_code: "",
      zip_code: "",
    });
  };

  const handleCancel = () => {
    setEditVisible(false);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrMsg("");
    if (file.size > 25000000) {
      toast.error("The file is over 25Mb, please choose another file", {
        containerId: "A",
      });
      return;
    }
    setIsLoadingFile(true);
    // setting up the reader
    const reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      const content = e.target?.result; // this is the content!
      try {
        const fileToUpload = await xanoPost("/upload/attachment", "admin", {
          content,
        });
        setFormDatas({ ...formDatas, logo: fileToUpload });
        setIsLoadingFile(false);
      } catch (err) {
        if (err instanceof Error)
          toast.error(`Error unable to load file: ${err.message}`, {
            containerId: "A",
          });
        setIsLoadingFile(false);
      }
    };
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
    if (formDatas.rooms?.find((room) => !room.title)) {
      setErrMsg("All rooms must have a Name");
      return;
    }
    if (formDatas.site_status === "Closed") {
      alert(
        "You have decided to close this site. Please inform all staff members to update their site information in their 'My Account' section."
      );
    }
    //Formatting
    const siteToPut: SiteType = {
      ...(formDatas as SiteType),
      name: firstLetterUpper(formDatas.name),
      address: firstLetterUpper(formDatas.address),
      city: firstLetterUpper(formDatas.city),
      rooms: [
        ...(formDatas.rooms ?? [])
          .filter((room) => room.title)
          .map((room) => {
            return { id: room.id, title: firstLetterUpper(room.title) };
          }),
      ],
      updates: [
        ...((formDatas as SiteType).updates || []),
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
      email: formDatas.email.toLowerCase(),
    };
    //Validation
    if (formDatas?.rooms?.length === 0) {
      alert("Please add at least one room for the appointments");
      return;
    }
    try {
      await siteSchema.validate(siteToPut);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      return;
    }
    //Submission
    setProgress(true);
    sitePut.mutate(siteToPut, {
      onSuccess: () => {
        setEditVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  return (
    site && (
      <div
        className="site-form__container"
        style={{ border: errMsg && editVisible ? "solid 1.5px red" : "" }}
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
    )
  );
};

export default SiteEdit;
