import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { AdminType, SiteType } from "../../../types/api";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { siteSchema } from "../../../validation/clinic/siteValidation";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import FormSite from "./FormSite";

type SiteFormProps = {
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const SiteForm = ({ setAddVisible }) => {
  const { user } = useUserContext() as { user: AdminType };
  const { socket } = useSocketContext();
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [formDatas, setFormDatas] = useState<SiteType>({
    name: "",
    address: "",
    postal_code: "",
    zip_code: "",
    province_state: "",
    city: "",
    phone: "",
    fax: "",
    email: "",
    rooms: [],
    site_status: "Open",
  });
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [progress, setProgress] = useState(false);

  const handleCancel = () => {
    setAddVisible(false);
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
        const fileToUpload = await xanoPost(
          "/upload/attachment",
          "admin",

          { content }
        );
        setFormDatas({ ...formDatas, logo: fileToUpload });
        setIsLoadingFile(false);
      } catch (err) {
        toast.error(`Error unable to load file: ${err.message}`, {
          containerId: "A",
        });
        setIsLoadingFile(false);
      }
    };
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

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    //Formatting
    const datasToPost = {
      ...formDatas,
      name: firstLetterUpper(formDatas.name),
      address: firstLetterUpper(formDatas.address),
      city: firstLetterUpper(formDatas.city),
      rooms: [
        ...formDatas.rooms.map((room) => {
          return { id: room.id, title: firstLetterUpper(room.title) };
        }),
        { id: "z", title: "To Be Determined" },
      ],
      created_by_id: user.id,
      date_created: nowTZTimestamp(),
    };
    //Validation
    if (formDatas.rooms.length === 0) {
      setErrMsg("Please add at least one room for the appointments");
      return;
    }
    if (formDatas.rooms.find((room) => !room.title)) {
      setErrMsg("All rooms should have a Name");
      return;
    }
    try {
      await siteSchema.validate(datasToPost);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    //Submission
    try {
      setProgress(true);
      const response = await xanoPost("/sites", "admin", datasToPost);
      socket?.emit("message", {
        route: "SITES",
        action: "create",
        content: { data: response },
      });
      setAddVisible(false);
      toast.success(`New site successfully added to database`, {
        containerId: "A",
      });
      setProgress(false);
    } catch (err) {
      toast.error(`Unable to add new site to database: ${err.message}`, {
        containerId: "A",
      });
      setProgress(false);
    }
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
